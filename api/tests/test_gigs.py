from fastapi.testclient import TestClient
from queries.gigs import GigQueries
from models.gigs import GigOut, Location
from main import app

client = TestClient(app)


class FakeGigQueries:
    def get_all_gigs(self):
        return [
            GigOut(
                title="testing",
                price=100,
                boxes="100-150",
                description="litte test",
                pickup_location=Location(
                    street_address="1111 Sierra Ave",
                    city="Las Vegas",
                    state="NV",
                    zip_code="89123"
                ),
                pickup_date="2024-06-25T10:00:00",
                dropoff_location=Location(
                    street_address="2222 Baller Drive",
                    city="Las Vegas",
                    state="NV",
                    zip_code="89123"
                ),
                dropoff_date="2024-06-25T12:00:00",
                created_on_date="2024-06-25T10:00:00",
                id=1,
            ),
            GigOut(
                title="testingagain",
                price=200,
                boxes="<50",
                description="litte test again",
                pickup_location=Location(
                    street_address="1111 Sierra Ave",
                    city="Las Vegas",
                    state="NV",
                    zip_code="89123"
                ),
                pickup_date="2024-06-25T10:00:00",
                dropoff_location=Location(
                    street_address="2222 Baller Drive",
                    city="Las Vegas",
                    state="NV",
                    zip_code="89123"
                ),
                dropoff_date="2024-06-25T12:00:00",
                created_on_date="2024-06-25T10:00:00",
                id=2,
            ),
        ]


def test_get_all_gigs():
    # ARRANGE
    app.dependency_overrides[GigQueries] = FakeGigQueries
    # ACT
    response = client.get("/api/gigs")
    data = response.json()

    # ASSERT
    assert response.status_code == 200
    for i, gig in enumerate(data):
        assert gig["id"] == i + 1
        assert "title" in gig
        assert "price" in gig
        assert "boxes" in gig
        assert "description" in gig
        assert "pickup_location" in gig
        assert "pickup_date" in gig
        assert "dropoff_location" in gig
        assert "dropoff_date" in gig
        assert "created_on_date" in gig
