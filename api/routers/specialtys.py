from fastapi import APIRouter, Depends
from typing import List
from queries.specialtys import SpecialtyQueries
from models.specialtys import SpecialtyIn, SpecialtyOut, DeleteSpecialty

router = APIRouter(tags=["Specialtys"])


@router.get("/api/specialtys", response_model=List[SpecialtyOut])
def get_all_specialtys(queries: SpecialtyQueries = Depends()):
    return queries.get_all_specialtys()


@router.post("/api/specialtys", response_model=SpecialtyOut)
def create_specialty(
    specialty: SpecialtyIn, queries: SpecialtyQueries = Depends()
):
    return queries.create_specialty(specialty)


@router.delete(
    "/api/specialtys/{specialty_id}", response_model=DeleteSpecialty
)
def delete_specialty(specialty_id: int, queries: SpecialtyQueries = Depends()):
    success = queries.delete(specialty_id=specialty_id)
    return {"success": success}


@router.get("/api/specialtys/{specialty_id}", response_model=SpecialtyOut)
def get_specialty_by_id(
    specialty_id: int, queries: SpecialtyQueries = Depends()
) -> SpecialtyOut:
    return queries.get_specialty_by_id(specialty_id)
