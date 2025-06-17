from typing import List
from fastapi import APIRouter, Depends, HTTPException
from models.users import (
    UserResponse,
    UserDetails,
    GigsForPackers,
    GigsForPackersUpdateIn
)
from models.specialtys import PackerSpecialtyIn, PackerSpecialtyOut
from queries.specialtys import SpecialtyQueries
from queries.user_packers import PackerQueries
from queries.gigs import GigQueries, GigOut
from utils.authentication import try_get_jwt_user_data

router = APIRouter(tags=["Packers"])

user_exception = HTTPException(status_code=401, detail="You must be logged in")
specialty_exception = HTTPException(
    status_code=404, detail="Unable to find Specialty"
)
packer_exception = HTTPException(status_code=404, detail="Unable to find Packer")
gig_exception = HTTPException(status_code=404, detail="Unable to find Gig")
specialty_for_packer_exception = HTTPException(
    status_code=409,
    detail="HTTP_409_CONFLICT: Specialty for Packer already exists",
)
gig_for_packer_exception = HTTPException(
    status_code=409, detail="HTTP_409_CONFLICT: Gig already assigned to Packer"
)


@router.get("/api/packer", response_model=UserDetails)
async def get_packer_profile(
    packer: PackerQueries = Depends(),
    logged_packer: UserResponse = Depends(try_get_jwt_user_data),
) -> UserDetails:
    if logged_packer is None:
        raise user_exception
    packer = packer.get_by_id(id=logged_packer.id)
    if not packer:
        raise packer_exception
    return packer


@router.get("/api/packers", response_model=List[UserDetails])
async def list_all_packers(
    packers: PackerQueries = Depends(),
    logged_packer: UserResponse = Depends(try_get_jwt_user_data),
) -> List[UserDetails]:
    if not logged_packer:
        raise user_exception
    packer_list = packers.get_all_packers()
    if packer_list is None:
        return "unable to find any packers"
    return packer_list


@router.post("/api/packer/specialtys", response_model=PackerSpecialtyOut)
async def add_packer_specialty(
    specialty: PackerSpecialtyIn,
    specialtys_queries: SpecialtyQueries = Depends(),
    logged_packer: UserResponse = Depends(try_get_jwt_user_data),
):
    if logged_packer is None:
        raise user_exception
    special = specialtys_queries.get_specialty_by_id(specialty.specialty_id)
    if special is None:
        raise specialty_exception
    already_exists = specialtys_queries.get_packer_specialty_by_id(
        user_id=logged_packer.id, specialty_id=specialty.specialty_id
    )
    if already_exists:
        return None
    packer_special = specialtys_queries.create_packer_specialty(
        user_id=logged_packer.id,
        specialty_id=specialty.specialty_id,
        specialty_type_id=special.specialty_type_id,
        specialty_name=special.name,
    )
    return packer_special


@router.delete(
    "/api/packer/{packer_id}/specialtys/{specialty_id}", response_model=bool
)
def remove_packer_specialty(
    packer_id: int,
    specialty_id: int,
    packer_specialty_query: SpecialtyQueries = Depends(),
    logged_packer: UserResponse = Depends(try_get_jwt_user_data),
) -> bool:
    if logged_packer is None:
        raise user_exception
    return packer_specialty_query.delete_packer_specialty(
        specialty_id=specialty_id, user_id=packer_id
    )


@router.delete("/api/packer/gigs/{gig_id}", response_model=bool)
def remove_packer_from_gig(
    gig_id: int,
    gigs: GigQueries = Depends(),
    logged_packer: UserResponse = Depends(try_get_jwt_user_data),
) -> bool:
    if logged_packer is None:
        raise user_exception
    return gigs.delete_packer_from_gig(packer_id=logged_packer.id, gig_id=gig_id)


@router.get(
    "/api/packer/{packer_id}/specialtys", response_model=List[PackerSpecialtyOut]
)
def list_specialties_for_packer_by_id(
    packer_id: int,
    packers: PackerQueries = Depends(),
    specialties: SpecialtyQueries = Depends(),
) -> List[PackerSpecialtyOut]:
    packer = packers.get_by_id(id=packer_id)
    if not packer:
        raise packer_exception
    packer_specialties = specialties.get_all_specialties_by_packer(user_id=packer_id)
    return packer_specialties


@router.post("/api/packer/gigs/{gig_id}", response_model=GigsForPackers)
def add_gig_to_packer(
    gig_id: int,
    packers: PackerQueries = Depends(),
    gigs: GigQueries = Depends(),
    specialtys: SpecialtyQueries = Depends(),
    logged_packer: UserResponse = Depends(try_get_jwt_user_data),
) -> GigsForPackers:

    if not logged_packer:
        raise user_exception

    gig = gigs.get_gig_by_id(gig_id=gig_id)
    if gig is None:
        raise gig_exception

    packer = packers.get_by_id(id=logged_packer.id)
    if packer is None:
        raise packer_exception

    gig_specialties = specialtys.get_all_specialties_by_gig(gig_id=gig_id)
    packer_specialties = specialtys.get_all_specialties_by_packer(
        user_id=logged_packer.id
    )
    gig_specialty_ids = set(
        [gig_specialty.specialty_id for gig_specialty in gig_specialties]
    )
    packer_specialty_ids = set(
        [packer_specialty.specialty_id for packer_specialty in packer_specialties]
    )

    if not gig_specialty_ids.issubset(packer_specialty_ids):
        return "Sorry, you do not meet specialty requirements"

    gig_already_added = gigs.get_gig_for_packer_by_id(
        packer_id=logged_packer.id, gig_id=gig_id
    )
    if gig_already_added is not None:
        raise gig_for_packer_exception
    gig_for_packer = gigs.add_gig_to_packer(gig_id=gig_id, packer_id=logged_packer.id)
    return gig_for_packer


@router.get("/api/packers/gigs", response_model=List[GigsForPackers])
async def get_gigs_for_packers_list(
    packer: UserResponse = Depends(try_get_jwt_user_data),
    queries: GigQueries = Depends(),
) -> List[GigsForPackers]:
    if not packer:
        raise user_exception

    return queries.get_all_gigs_for_packers()


@router.get("/api/packer/{packer_id}/gigs", response_model=List[GigsForPackers])
async def get_gigs_for_packer(
    packer: UserResponse = Depends(try_get_jwt_user_data),
    queries: GigQueries = Depends(),
) -> List[GigsForPackers]:
    if not packer:
        raise user_exception
    gigs = queries.get_all_gigs_for_packer_by_id_for_status(packer_id=packer.id)
    if gigs is None:
        raise HTTPException(
            status_code=404, detail=f"no gigs for packer with Packer ID:{packer.id}"
        )
    return gigs


@router.get("/api/packer/gigs/booked", response_model=List[GigOut])
async def get_booked_gigs_for_packer(
    packer: UserResponse = Depends(try_get_jwt_user_data),
    queries: GigQueries = Depends(),
) -> List[GigOut]:
    if not packer:
        raise user_exception
    gigs = queries.get_booked_gigs_for_packer_by_id(packer_id=packer.id)
    return gigs


@router.get("/api/packer/{packer_id}/gig/{gig_id}", response_model=GigOut)
async def show_gig_details_by_gig_id_for_packer(
    packer_id: int,
    gig_id: int,
    packer: UserResponse = Depends(try_get_jwt_user_data),
    queries: GigQueries = Depends(),
) -> GigOut:
    if not packer:
        raise user_exception
    gig_for_packer_id = queries.get_gig_for_packer_by_id(
        gig_id=gig_id, packer_id=packer_id
    )
    gig_details = queries.get_gig_by_id(gig_id=gig_for_packer_id.gig_id)
    return gig_details


@router.put("/api/packer/edit", response_model=UserResponse)
async def edit_packer_profile(
    edit_user: UserDetails,
    packer: UserResponse = Depends(try_get_jwt_user_data),
    queries: PackerQueries = Depends(),
) -> UserResponse:
    if not packer:
        raise user_exception
    updated_users = queries.edit_packer_profile(
        user_id=packer.id, edit_user=edit_user
    )
    return updated_users


@router.get("/api/packer/gigs/all", response_model=List[GigOut])
async def get_all_gigs_for_packer(
    packer: UserResponse = Depends(try_get_jwt_user_data),
    queries: GigQueries = Depends(),
) -> List[GigOut]:
    if not packer:
        raise user_exception
    gigs = queries.get_all_gigs_for_packer_by_id(packer_id=packer.id)
    return gigs


@router.put("/api/packer/gig/{gig_id}", response_model=GigsForPackers)
def update_gig_for_packer(
    gig_id: int,
    update: GigsForPackersUpdateIn,
    gigs: GigQueries = Depends(),
    logged_packer: UserResponse = Depends(try_get_jwt_user_data),
) -> GigsForPackers:
    if not logged_packer:
        raise user_exception
    print(update)
    updated_gig = gigs.update_gig_for_packer(gig_id, update)
    if not updated_gig:
        return "Not able to update gig"
    return updated_gig
