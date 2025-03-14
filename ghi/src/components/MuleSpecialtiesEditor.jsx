import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  useGetAllSpecialtysQuery,
  useAddMuleSpecialtyMutation,
  useListSpecialtiesForMuleQuery,
  useDeleteMuleSpecialtyMutation,
  useGetMuleQuery,
} from '../app/apiSlice';
import SignInForm from './SignInForm';

const MuleSpecialtiesEditor = () => {
  const navigate = useNavigate();
  const { muleId } = useParams();
  const { data: mule, isLoading: isMuleLoading } = useGetMuleQuery();
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedSpecialtys, setSelectedSpecialtys] = useState([]);
  const { data: muleSpecialtys, isLoading: isMuleSpecialtysLoading } = useListSpecialtiesForMuleQuery(muleId);
  const { data: specialtys, isLoading: isSpecialtysLoading } = useGetAllSpecialtysQuery();
  const [addMuleSpecialty, { isSuccess, isError, error }] = useAddMuleSpecialtyMutation();
  const [deleteMuleSpecialty] = useDeleteMuleSpecialtyMutation();

  useEffect(() => {
    if (isSuccess) navigate(`/mule/${muleId}`)
  }, [isSuccess, isError, error, navigate]);

  useEffect(() => {
    if (muleSpecialtys) {
      setSelectedSpecialtys(muleSpecialtys.map(specialty => specialty.specialty_id.toString()));
    }
  }, [muleSpecialtys]);

  if (!mule) {
      return (
          <>
              <div className="mx-auto w-1/2 p-4">
                  <h1> Please log in or sign up to continue!</h1>
              </div>
              <div>
                  <SignInForm />
              </div>
          </>
      )
  }

  const handleSpecialtyChange = (event) => {
    const { value, checked } = event.target;
    setSelectedSpecialtys((prevSelected) =>
      checked
        ? [...prevSelected, value]
        : prevSelected.filter((id) => id !== value)
    );
  };

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      for (let specialty of selectedSpecialtys) {
        if (!muleSpecialtys.some(existing => existing.specialty_id === parseInt(specialty))) {
          await addMuleSpecialty({
            specialty_id: parseInt(specialty),
          }).unwrap();
        }
      }

      for (let specialty of muleSpecialtys) {
        if (!selectedSpecialtys.includes(specialty.specialty_id.toString())) {
          await deleteMuleSpecialty({
            muleId: parseInt(muleId),
            specialtyId: parseInt(specialty.specialty_id)
          }).unwrap();
        }
      }
      navigate(`/mule/${muleId}`)
    } catch (err) {
      console.error('Failed to update specialties:', err);
      setErrorMessage('Failed to update specialties');
    }
  }

  if (isSpecialtysLoading || isMuleSpecialtysLoading || isMuleLoading) {
    return <div>Loading specialties...</div>;
  }

  const equipmentSpecialties = specialtys.filter(specialty => specialty.specialty_type_id === 1 )
  const experienceSpecialties = specialtys.filter(specialty => specialty.specialty_type_id === 2 )
  const vehicleSpecialties = specialtys.filter(specialty => specialty.specialty_type_id === 3 )

  return (
      <div className="flex justify-center outline-gray-100">
          <form className="bg-white rounded w-1/2 px-10 pb-8 m-9">
              {errorMessage && <div className="error">{errorMessage}</div>}
              <h1 className="pl-0 pb-2">Do you have any of this equipment?</h1>
              <p className="px-10 pl-0 mb-7">Select all that apply.</p>
              <div className="flex justify-start flex-wrap">
                  {equipmentSpecialties.map((specialty) => (
                      <div
                          key={specialty.id}
                          className="flex items-center mb-2"
                      >
                          <input
                              type="checkbox"
                              id={`specialty-${specialty.id}`}
                              name={specialty.name}
                              value={specialty.id}
                              onChange={handleSpecialtyChange}
                              checked={selectedSpecialtys.includes(
                                  specialty.id.toString()
                              )}
                              className="hidden"
                          />
                          <label
                              htmlFor={`specialty-${specialty.id}`}
                              className={`cursor-pointer py-4 px-8 mr-2 rounded-full ${
                                  selectedSpecialtys.includes(
                                      specialty.id.toString()
                                  )
                                      ? 'bg-gray-900 text-white'
                                      : 'bg-gray-200 text-gray-700'
                              }`}
                          >
                              {specialty.name}
                          </label>
                      </div>
                  ))}
              </div>
              <h1 className="pl-0 pb-2 pt-8">
                  Do you have experience in these?
              </h1>
              <p className="px-10 pl-0 mb-7">Select all that apply.</p>
              <div className="flex justify-start flex-wrap">
                  {experienceSpecialties.map((specialty) => (
                      <div
                          key={specialty.id}
                          className="flex items-center mb-2"
                      >
                          <input
                              type="checkbox"
                              id={`specialty-${specialty.id}`}
                              name={specialty.name}
                              value={specialty.id}
                              onChange={handleSpecialtyChange}
                              checked={selectedSpecialtys.includes(
                                  specialty.id.toString()
                              )}
                              className="hidden"
                          />
                          <label
                              htmlFor={`specialty-${specialty.id}`}
                              className={`cursor-pointer py-4 px-8 mr-2 rounded-full ${
                                  selectedSpecialtys.includes(
                                      specialty.id.toString()
                                  )
                                      ? 'bg-gray-900 text-white'
                                      : 'bg-gray-200 text-gray-700'
                              }`}
                          >
                              {specialty.name}
                          </label>
                      </div>
                  ))}
              </div>
              <h1 className="pl-0 pb-2 pt-8">
                  Do you have any of these vehicles??
              </h1>
              <p className="px-10 pl-0 mb-7">Select all that apply.</p>
              <div className="flex justify-start flex-wrap">
                  {vehicleSpecialties.map((specialty) => (
                      <div
                          key={specialty.id}
                          className="flex items-center mb-2"
                      >
                          <input
                              type="checkbox"
                              id={`specialty-${specialty.id}`}
                              name={specialty.name}
                              value={specialty.id}
                              onChange={handleSpecialtyChange}
                              checked={selectedSpecialtys.includes(
                                  specialty.id.toString()
                              )}
                              className="hidden"
                          />
                          <label
                              htmlFor={`specialty-${specialty.id}`}
                              className={`cursor-pointer py-4 px-8 mr-2 rounded-full ${
                                  selectedSpecialtys.includes(
                                      specialty.id.toString()
                                  )
                                      ? 'bg-gray-900 text-white'
                                      : 'bg-gray-200 text-gray-700'
                              }`}
                          >
                              {specialty.name}
                          </label>
                      </div>
                  ))}
              </div>
              <div className="flex justify-end pt-9">
                  <Link
                      className="
            text-gray-700
            font-bold py-4 px-8 focus:outline-none focus:shadow-outline"
                      to={`/mule/${muleId}`}
                  >
                      Cancel
                  </Link>
                  <button
                      type="submit"
                      onClick={handleSubmit}
                      className="
            bg-gradient-to-br from-orange-600 to-orange-400 text-white
            font-bold py-4 px-8 rounded-full shadow-[0_10px_20px_-9px_rgba(227,136,0,1)] focus:outline-none
            focus:shadow-outline hover:brightness-[1.05] hover:scale-[1.03]
            hover:shadow-[0_35px_60px_-9px_rgba(227,136,0,0.7)]
            transition duration-200 ease-in-out"
                  >
                      Save Specialties
                  </button>
              </div>
          </form>
      </div>
  )
}

export default MuleSpecialtiesEditor
