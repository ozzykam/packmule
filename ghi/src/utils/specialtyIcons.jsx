// Specialty Icon Mapping Service
// Uses local PNG images from /images/specialties_icons/

export const specialtyIconMap = {
    'heavy straps': {
        id: 1,
        name: 'heavy straps',
        icon: <img src="/images/specialties_icons/heavy-straps.png" alt="Heavy Straps" className="w-full h-full object-contain" />,
    },
    dolly: {
        id: 2,
        name: 'dolly',
        icon: <img src="/images/specialties_icons/dolly.png" alt="Dolly" className="w-full h-full object-contain" />,    },
    piano: {
        id: 3,
        name: 'piano',
        icon: <img src="/images/specialties_icons/piano.png" alt="Piano" className="w-full h-full object-contain" />,
    },
    antiques: {
        id: 4,
        name: 'antiques',
        icon: <img src="/images/specialties_icons/antiques.png" alt="Antiques" className="w-full h-full object-contain" />,
    },
    aquariums: {
        id: 5,
        name: 'aquariums',
        icon: <img src="/images/specialties_icons/aquariums.png" alt="Aquariums" className="w-full h-full object-contain" />,
    },
    'large animals': {
        id: 6,
        name: 'large animals',
        icon: <img src="/images/specialties_icons/large-animals.png" alt="Large Animals" className="w-full h-full object-contain" />,
    },
    pets: {
        id: 7,
        name: 'pets',
        icon: <img src="/images/specialties_icons/pets.png" alt="Pets" className="w-full h-full object-contain" />,
    },
    'fine art': {
        id: 8,
        name: 'fine art',
        icon: <img src="/images/specialties_icons/fine-art.png" alt="Fine Art" className="w-full h-full object-contain" />,
    },
    'box truck': {
        id: 9,
        name: 'box truck',
        icon: <img src="/images/specialties_icons/box-truck.png" alt="Box Truck" className="w-full h-full object-contain" />,
    },
    crane: {
        id: 10,
        name: 'crane',
        icon: <img src="/images/specialties_icons/crane.png" alt="Crane" className="w-full h-full object-contain" />,
    },
    'cargo van': {
        id: 11,
        name: 'cargo van',
        icon: <img src="/images/specialties_icons/cargo-van.png" alt="Cargo Van" className="w-full h-full object-contain" />,
    },
    'horse trailer': {
        id: 12,
        name: 'horse trailer',
        icon: <img src="/images/specialties_icons/horse-trailer.png" alt="Horse Trailer" className="w-full h-full object-contain" />,
    },
    'flatbed trailer': {
        id: 13,
        name: 'flatbed trailer',
        icon: <img src="/images/specialties_icons/flatbed-trailer.png" alt="Flatbed Trailer" className="w-full h-full object-contain" />,
    },
    'vehicle trailer': {
        id: 14,
        name: 'vehicle trailer',
        icon: <img src="/images/specialties_icons/vehicle-trailer.png" alt="Vehicle Trailer" className="w-full h-full object-contain" />,
    },
}

// Get specialty info by ID from a list of specialty objects
export const getSpecialtyById = (specialtyId, specialties = []) => {
    if (!specialties?.length) return null
    return specialties.find((specialty) => specialty.id === specialtyId)
}

// Get specialty icon object by name
export const getSpecialtyIcon = (specialtyName) => {
    const normalizedName = specialtyName?.toLowerCase().trim()
    return (
        specialtyIconMap[normalizedName] || {
            icon: <img src="/images/specialties_icons/specialty_item.png" alt="Unknown Specialty" className="w-full h-full object-contain" />,
            color: 'text-gray-600',
            bgColor: 'bg-gray-100',
        }
    )
}

// Combines ID lookup with icon mapping
export const getSpecialtyIconById = (specialtyId, specialties = []) => {
    const specialty = getSpecialtyById(specialtyId, specialties)
    if (!specialty) {
        return {
            icon: <img src="/images/specialties_icons/specialty_item.png" alt="Unknown Specialty" className="w-full h-full object-contain" />,
            color: 'text-gray-600',
            bgColor: 'bg-gray-100',
            name: 'Unknown',
        }
    }

    const iconData = getSpecialtyIcon(specialty.name)
    return {
        ...iconData,
        name: specialty.name,
    }
}
