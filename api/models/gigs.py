from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


class Location(BaseModel):
    street_address: str
    street_address_two: Optional[str] = None
    city: str
    state: str
    zip_code: str


class GigIn(BaseModel):
    title: str
    price: float
    boxes: str
    description: str
    pickup_location: Location
    pickup_date: datetime
    dropoff_location: Location
    dropoff_date: datetime
    created_on_date: datetime
    customer_id: int
    images: Optional[List[str]] = []  # List of image URLs/paths
    specialties: Optional[List[int]] = []  # List of specialty IDs
    featured_image_index: Optional[int] = None  # Index of featured image


class GigOut(GigIn):
    id: int


class GigList(BaseModel):
    gigs: list[GigOut]


class DeleteGig(BaseModel):
    success: bool


class GigInWithStatus(GigIn):
    gig_status_id: int
    packer_id: int
