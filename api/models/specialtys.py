from pydantic import BaseModel


class SpecialtyIn(BaseModel):
    name: str
    specialty_type_id: int
    description: str


class SpecialtyOut(SpecialtyIn):
    id: int


class SpecialtyList(BaseModel):
    specialtys: list[SpecialtyOut]


class DeleteSpecialty(BaseModel):
    success: bool


class MuleSpecialtyIn(BaseModel):
    specialty_id: int


class MuleSpecialtyOut(MuleSpecialtyIn):
    id: int
    user_id: int
    specialty_type_id: int
    specialty_name: str


class GigSpecialtyIn(BaseModel):
    specialty_id: int


class GigSpecialtyOut(GigSpecialtyIn):
    id: int
    gig_id: int
    specialty_name: str
    specialty_type_id: int
