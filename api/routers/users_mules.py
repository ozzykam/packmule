from typing import List
from fastapi import APIRouter, Depends, HTTPException
from models.users import (
    UserResponse,
    UserDetails,
    GigsForMules,
    GigsForMulesUpdateIn
)
from models.specialtys import MuleSpecialtyIn, MuleSpecialtyOut
from queries.specialtys import SpecialtyQueries
from queries.user_mules import MuleQueries
from queries.gigs import GigQueries, GigOut
from utils.authentication import try_get_jwt_user_data

router = APIRouter(tags=["Mules"])

user_exception = HTTPException(status_code=401, detail="You must be logged in")
specialty_exception = HTTPException(
    status_code=404, detail="Unable to find Specialty"
)
mule_exception = HTTPException(status_code=404, detail="Unable to find Mule")
gig_exception = HTTPException(status_code=404, detail="Unable to find Gig")
specialty_for_mule_exception = HTTPException(
    status_code=409,
    detail="HTTP_409_CONFLICT: Specialty for Mule already exists",
)
gig_for_mule_exception = HTTPException(
    status_code=409, detail="HTTP_409_CONFLICT: Gig already assigned to Mule"
)


@router.get("/api/mule", response_model=UserDetails)
async def get_mule_profile(
    mule: MuleQueries = Depends(),
    logged_mule: UserResponse = Depends(try_get_jwt_user_data),
) -> UserDetails:
    if logged_mule is None:
        raise user_exception
    mule = mule.get_by_id(id=logged_mule.id)
    if not mule:
        raise mule_exception
    return mule


@router.get("/api/mules", response_model=List[UserDetails])
async def list_all_mules(
    mules: MuleQueries = Depends(),
    logged_mule: UserResponse = Depends(try_get_jwt_user_data),
) -> List[UserDetails]:
    if not logged_mule:
        raise user_exception
    mule_list = mules.get_all_mules()
    if mule_list is None:
        return "unable to find any mules"
    return mule_list


@router.post("/api/mule/specialtys", response_model=MuleSpecialtyOut)
async def add_mule_specialty(
    specialty: MuleSpecialtyIn,
    specialtys_queries: SpecialtyQueries = Depends(),
    logged_mule: UserResponse = Depends(try_get_jwt_user_data),
):
    if logged_mule is None:
        raise user_exception
    special = specialtys_queries.get_specialty_by_id(specialty.specialty_id)
    if special is None:
        raise specialty_exception
    already_exists = specialtys_queries.get_mule_specialty_by_id(
        user_id=logged_mule.id, specialty_id=specialty.specialty_id
    )
    if already_exists:
        return None
    mule_special = specialtys_queries.create_mule_specialty(
        user_id=logged_mule.id,
        specialty_id=specialty.specialty_id,
        specialty_type_id=special.specialty_type_id,
        specialty_name=special.name,
    )
    return mule_special


@router.delete(
    "/api/mule/{mule_id}/specialtys/{specialty_id}", response_model=bool
)
def remove_mule_specialty(
    mule_id: int,
    specialty_id: int,
    mule_specialty_query: SpecialtyQueries = Depends(),
    logged_mule: UserResponse = Depends(try_get_jwt_user_data),
) -> bool:
    if logged_mule is None:
        raise user_exception
    return mule_specialty_query.delete_mule_specialty(
        specialty_id=specialty_id, user_id=mule_id
    )


@router.delete("/api/mule/gigs/{gig_id}", response_model=bool)
def remove_mule_from_gig(
    gig_id: int,
    gigs: GigQueries = Depends(),
    logged_mule: UserResponse = Depends(try_get_jwt_user_data),
) -> bool:
    if logged_mule is None:
        raise user_exception
    return gigs.delete_mule_from_gig(mule_id=logged_mule.id, gig_id=gig_id)


@router.get(
    "/api/mule/{mule_id}/specialtys", response_model=List[MuleSpecialtyOut]
)
def list_specialties_for_mule_by_id(
    mule_id: int,
    mules: MuleQueries = Depends(),
    specialties: SpecialtyQueries = Depends(),
) -> List[MuleSpecialtyOut]:
    mule = mules.get_by_id(id=mule_id)
    if not mule:
        raise mule_exception
    mule_specialties = specialties.get_all_specialties_by_mule(user_id=mule_id)
    return mule_specialties


@router.post("/api/mule/gigs/{gig_id}", response_model=GigsForMules)
def add_gig_to_mule(
    gig_id: int,
    mules: MuleQueries = Depends(),
    gigs: GigQueries = Depends(),
    specialtys: SpecialtyQueries = Depends(),
    logged_mule: UserResponse = Depends(try_get_jwt_user_data),
) -> GigsForMules:

    if not logged_mule:
        raise user_exception

    gig = gigs.get_gig_by_id(gig_id=gig_id)
    if gig is None:
        raise gig_exception

    mule = mules.get_by_id(id=logged_mule.id)
    if mule is None:
        raise mule_exception

    gig_specialties = specialtys.get_all_specialties_by_gig(gig_id=gig_id)
    mule_specialties = specialtys.get_all_specialties_by_mule(
        user_id=logged_mule.id
    )
    gig_specialty_ids = set(
        [gig_specialty.specialty_id for gig_specialty in gig_specialties]
    )
    mule_specialty_ids = set(
        [mule_specialty.specialty_id for mule_specialty in mule_specialties]
    )

    if not gig_specialty_ids.issubset(mule_specialty_ids):
        return "Sorry, you do not meet specialty requirements"

    gig_already_added = gigs.get_gig_for_mule_by_id(
        mule_id=logged_mule.id, gig_id=gig_id
    )
    if gig_already_added is not None:
        raise gig_for_mule_exception
    gig_for_mule = gigs.add_gig_to_mule(gig_id=gig_id, mule_id=logged_mule.id)
    return gig_for_mule


@router.get("/api/mules/gigs", response_model=List[GigsForMules])
async def get_gigs_for_mules_list(
    mule: UserResponse = Depends(try_get_jwt_user_data),
    queries: GigQueries = Depends(),
) -> List[GigsForMules]:
    if not mule:
        raise user_exception

    return queries.get_all_gigs_for_mules()


@router.get("/api/mule/{mule_id}/gigs", response_model=List[GigsForMules])
async def get_gigs_for_mule(
    mule: UserResponse = Depends(try_get_jwt_user_data),
    queries: GigQueries = Depends(),
) -> List[GigsForMules]:
    if not mule:
        raise user_exception
    gigs = queries.get_all_gigs_for_mule_by_id_for_status(mule_id=mule.id)
    if gigs is None:
        raise HTTPException(
            status_code=404, detail=f"no gigs for mule with Mule ID:{mule.id}"
        )
    return gigs


@router.get("/api/mule/gigs/booked", response_model=List[GigOut])
async def get_booked_gigs_for_mule(
    mule: UserResponse = Depends(try_get_jwt_user_data),
    queries: GigQueries = Depends(),
) -> List[GigOut]:
    if not mule:
        raise user_exception
    gigs = queries.get_booked_gigs_for_mule_by_id(mule_id=mule.id)
    return gigs


@router.get("/api/mule/{mule_id}/gig/{gig_id}", response_model=GigOut)
async def show_gig_details_by_gig_id_for_mule(
    mule_id: int,
    gig_id: int,
    mule: UserResponse = Depends(try_get_jwt_user_data),
    queries: GigQueries = Depends(),
) -> GigOut:
    if not mule:
        raise user_exception
    gig_for_mule_id = queries.get_gig_for_mule_by_id(
        gig_id=gig_id, mule_id=mule_id
    )
    gig_details = queries.get_gig_by_id(gig_id=gig_for_mule_id.gig_id)
    return gig_details


@router.put("/api/mule/edit", response_model=UserResponse)
async def edit_mule_profile(
    edit_user: UserDetails,
    mule: UserResponse = Depends(try_get_jwt_user_data),
    queries: MuleQueries = Depends(),
) -> UserResponse:
    if not mule:
        raise user_exception
    updated_users = queries.edit_mule_profile(
        user_id=mule.id, edit_user=edit_user
    )
    return updated_users


@router.get("/api/mule/gigs/all", response_model=List[GigOut])
async def get_all_gigs_for_mule(
    mule: UserResponse = Depends(try_get_jwt_user_data),
    queries: GigQueries = Depends(),
) -> List[GigOut]:
    if not mule:
        raise user_exception
    gigs = queries.get_all_gigs_for_mule_by_id(mule_id=mule.id)
    return gigs


@router.put("/api/mule/gig/{gig_id}", response_model=GigsForMules)
def update_gig_for_mule(
    gig_id: int,
    update: GigsForMulesUpdateIn,
    gigs: GigQueries = Depends(),
    logged_mule: UserResponse = Depends(try_get_jwt_user_data),
) -> GigsForMules:
    if not logged_mule:
        raise user_exception
    print(update)
    updated_gig = gigs.update_gig_for_mule(gig_id, update)
    if not updated_gig:
        return "Not able to update gig"
    return updated_gig
