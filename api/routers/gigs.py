from fastapi import APIRouter, Depends, HTTPException
from typing import List
from queries.gigs import GigQueries
from models.gigs import GigInWithStatus, GigOut, GigIn, DeleteGig
from models.specialtys import GigSpecialtyIn, GigSpecialtyOut
from queries.specialtys import SpecialtyQueries
from models.users import UserResponse
from utils.authentication import try_get_jwt_user_data

router = APIRouter(tags=["Gigs"])

user_exception = HTTPException(status_code=401, detail="You must be logged in")
specialty_exception = HTTPException(
    status_code=404, detail="Specialty not found"
)


@router.get("/api/gigs", response_model=List[GigOut])
def get_all_gigs(queries: GigQueries = Depends()):
    return queries.get_all_gigs()


@router.get("/api/gig/{gig_id}", response_model=GigOut)
def get_gig_by_id(gig_id: int, queries: GigQueries = Depends()) -> GigOut:
    return queries.get_gig_by_id(gig_id)


@router.post("/api/gigs", response_model=GigOut)
def create_a_gig(
    gig: GigIn, 
    queries: GigQueries = Depends(),
    specialty_queries: SpecialtyQueries = Depends(),
    user: UserResponse = Depends(try_get_jwt_user_data)
):
    if user is None:
        raise user_exception
    if user.user_type != "customer":
        raise HTTPException(status_code=403, detail="Only customers can create gigs")
    
    # Ensure customer_id is set to the authenticated user's ID
    gig.customer_id = user.id
    
    # Create the gig first
    created_gig = queries.create_gig(gig)
    
    # Add specialties to the gig if any were selected
    if gig.specialties:
        for specialty_id in gig.specialties:
            try:
                # First, get the specialty details
                specialty = specialty_queries.get_specialty_by_id(specialty_id)
                if specialty:
                    specialty_queries.create_gig_specialty(
                        gig_id=created_gig.id,
                        specialty_id=specialty_id,
                        specialty_name=specialty.name,
                        specialty_type_id=specialty.specialty_type_id
                    )
                else:
                    print(f"Specialty {specialty_id} not found, skipping")
            except Exception as e:
                # Continue if specialty fails, don't break gig creation
                print(f"Failed to add specialty {specialty_id} to gig {created_gig.id}: {e}")
    
    return created_gig


@router.delete("/api/gigs/{gig_id}", response_model=DeleteGig)
def delete_gig(
    gig_id: int, 
    queries: GigQueries = Depends(),
    user: UserResponse = Depends(try_get_jwt_user_data)
):
    if user is None:
        raise user_exception
    if user.user_type != "customer":
        raise HTTPException(status_code=403, detail="Only customers can delete gigs")
    
    # Get the existing gig to check ownership
    existing_gig = queries.get_gig_by_id(gig_id)
    if not existing_gig:
        raise HTTPException(status_code=404, detail="Gig not found")
    
    # Verify the customer owns this gig
    if existing_gig.customer_id != user.id:
        raise HTTPException(status_code=403, detail="You can only delete your own gigs")
    
    return {"success": queries.delete(gig_id=gig_id)}


@router.put("/api/gigs/{gig_id}", response_model=GigOut)
def update_gig(
    gig_id: int, 
    gig: GigIn, 
    queries: GigQueries = Depends(),
    specialty_queries: SpecialtyQueries = Depends(),
    user: UserResponse = Depends(try_get_jwt_user_data)
) -> GigOut:
    if user is None:
        raise user_exception
    if user.user_type != "customer":
        raise HTTPException(status_code=403, detail="Only customers can update gigs")
    
    # Get the existing gig to check ownership
    existing_gig = queries.get_gig_by_id(gig_id)
    if not existing_gig:
        raise HTTPException(status_code=404, detail="Gig not found")
    
    # Verify the customer owns this gig
    if existing_gig.customer_id != user.id:
        raise HTTPException(status_code=403, detail="You can only update your own gigs")
    
    # Ensure customer_id is set to the authenticated user's ID (prevent tampering)
    gig.customer_id = user.id
    
    # Update the gig first
    updated_gig = queries.update_gig(gig_id, gig)
    
    # Handle specialty updates if specialties are provided
    if hasattr(gig, 'specialties') and gig.specialties is not None:
        # Get current specialties for this gig
        current_specialties = specialty_queries.get_all_specialties_by_gig(gig_id)
        current_specialty_ids = {s.specialty_id for s in current_specialties}
        new_specialty_ids = set(gig.specialties)
        
        # Remove specialties that are no longer selected
        specialties_to_remove = current_specialty_ids - new_specialty_ids
        for specialty_id in specialties_to_remove:
            try:
                specialty_queries.delete_gig_specialty(gig_id, specialty_id)
            except Exception as e:
                print(f"Failed to remove specialty {specialty_id} from gig {gig_id}: {e}")
        
        # Add new specialties
        specialties_to_add = new_specialty_ids - current_specialty_ids
        for specialty_id in specialties_to_add:
            try:
                # Get the specialty details
                specialty = specialty_queries.get_specialty_by_id(specialty_id)
                if specialty:
                    specialty_queries.create_gig_specialty(
                        gig_id=gig_id,
                        specialty_id=specialty_id,
                        specialty_name=specialty.name,
                        specialty_type_id=specialty.specialty_type_id
                    )
                else:
                    print(f"Specialty {specialty_id} not found, skipping")
            except Exception as e:
                print(f"Failed to add specialty {specialty_id} to gig {gig_id}: {e}")
    
    return updated_gig


@router.post("/api/gigs/{gig_id}/specialtys", response_model=GigSpecialtyOut)
async def add_gig_specialty(
    gig_id: int,
    specialty: GigSpecialtyIn,
    specialty_queries: SpecialtyQueries = Depends(),
    user: UserResponse = Depends(try_get_jwt_user_data),
):
    if user is None:
        raise user_exception
    special = specialty_queries.get_specialty_by_id(specialty.specialty_id)
    if special is None:
        raise specialty_exception
    already_exists = specialty_queries.get_gig_specialty_by_id(
        gig_id=gig_id, specialty_id=specialty.specialty_id
    )
    if already_exists:
        raise HTTPException(
            status_code=409,
            detail=f"HTTP_409_CONFLICT:"
            f" Gig already has '{special.name}' specialty",
        )
    gig_special = specialty_queries.create_gig_specialty(
        gig_id=gig_id,
        specialty_id=specialty.specialty_id,
        specialty_name=special.name,
        specialty_type_id=special.specialty_type_id,
    )
    return gig_special


@router.get(
    "/api/gigs/{gig_id}/specialtys", response_model=List[GigSpecialtyOut]
)
def list_gig_specialties_for_gig_by_gig_id(
    gig_id: int,
    # user: UserResponse = Depends(try_get_jwt_user_data),
    specialties: SpecialtyQueries = Depends(),
) -> List[GigSpecialtyOut]:
    # if not user:
    #     raise user_exception
    gig_specialties = specialties.get_all_specialties_by_gig(gig_id=gig_id)
    if not gig_specialties:
        gig_specialties = []
    return gig_specialties


@router.delete("/api/gigs/{gig_id}/specialty", response_model=bool)
def remove_gig_specialty(
    gig_id: int,
    specialty: GigSpecialtyIn,
    gig_specialty_query: SpecialtyQueries = Depends(),
    user: UserResponse = Depends(try_get_jwt_user_data),
) -> bool:
    if user is None:
        raise user_exception
    return gig_specialty_query.delete_gig_specialty(
        specialty_id=specialty.specialty_id, gig_id=gig_id
    )


@router.get(
    "/api/users/{packer_id}/gigs", response_model=List[GigInWithStatus]
)
def get_gigs_for_packer_with_status(
    packer_id: int,
    queries: GigQueries = Depends(),
    user: UserResponse = Depends(try_get_jwt_user_data),
) -> List[GigInWithStatus]:
    if user is None or user.id != packer_id:
        raise user_exception
    return queries.get_gigs_for_packer_with_status(packer_id)
