from fastapi.testclient import TestClient
from queries.specialtys import SpecialtyQueries
from models.specialtys import SpecialtyOut
from main import app

client = TestClient(app)


class FakeSpecialtyQueries:
    def get_all_specialtys(self):
        return [
            SpecialtyOut(
                id=1,
                name="heavy straps",
                description="Description not yet provided",
                specialty_type_id=1,
            ),
            SpecialtyOut(
                id=2,
                name="dolly",
                description="Description not yet provided",
                specialty_type_id=2,
            ),
            SpecialtyOut(
                id=3,
                name="piano",
                description="Description not yet provided",
                specialty_type_id=2,
            ),
            SpecialtyOut(
                id=4,
                name="antiques",
                description="Description not yet provided",
                specialty_type_id=2,
            ),
            SpecialtyOut(
                id=5,
                name="aquariums",
                description="Description not yet provided",
                specialty_type_id=2,
            ),
            SpecialtyOut(
                id=6,
                name="large animals",
                description="Description not yet provided",
                specialty_type_id=2,
            ),
            SpecialtyOut(
                id=7,
                name="pets",
                description="Description not yet provided",
                specialty_type_id=2,
            ),
            SpecialtyOut(
                id=8,
                name="fine art",
                description="Description not yet provided",
                specialty_type_id=2,
            ),
            SpecialtyOut(
                id=9,
                name="box truck",
                description="Description not yet provided",
                specialty_type_id=3,
            ),
            SpecialtyOut(
                id=10,
                name="crane",
                description="Description not yet provided",
                specialty_type_id=3,
            ),
            SpecialtyOut(
                id=11,
                name="cargo van",
                description="Description not yet provided",
                specialty_type_id=3,
            ),
            SpecialtyOut(
                id=12,
                name="horse trailer",
                description="Description not yet provided",
                specialty_type_id=3,
            ),
            SpecialtyOut(
                id=13,
                name="flatbed trailer",
                description="Description not yet provided",
                specialty_type_id=3,
            ),
            SpecialtyOut(
                id=14,
                name="vehicle trailer",
                description="Description not yet provided",
                specialty_type_id=3,
            ),
        ]

    def get_specialty_by_id(self, specialty_id: int):
        specialties = self.get_all_specialtys()
        for specialty in specialties:
            if specialty.id == specialty_id:
                return specialty
            else:
                return None


def test_get_all_specialtys():

    # ARRANGE
    app.dependency_overrides[SpecialtyQueries] = FakeSpecialtyQueries

    # ACT
    response = client.get("/api/specialtys")
    data = response.json()

    # ASSERT
    assert response.status_code == 200
    assert len(data) == 14
    for i, specialty in enumerate(data):
        assert specialty["id"] == i + 1
        assert "name" in specialty
        assert "description" in specialty
        assert "specialty_type_id" in specialty


def test_get_specialty_by_id():

    # ARRANGE
    app.dependency_overrides[SpecialtyQueries] = FakeSpecialtyQueries

    # ACT
    response = client.get("/api/specialtys/1")
    data = response.json()

    # ASSERT
    assert response.status_code == 200
    assert data["id"] == 1
    assert data["name"] == "heavy straps"
    assert data["description"] == "Description not yet provided"
    assert data["specialty_type_id"] == 1
