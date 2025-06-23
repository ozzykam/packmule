import React from 'react'
import { getSpecialtyIcon, getSpecialtyIconById } from '../utils/specialtyIcons.jsx'

const SpecialtyIcon = ({ specialtyName, specialtyId, specialties, showName = true, size = 'sm' }) => {
    const sizeClasses = {
        'xs': 'max-w-6 max-h-6',
        'sm': 'max-w-6 max-h-6', 
        'md': 'max-w-6 max-h-6',
        'lg': 'max-w-6 max-h-6',
        'xl': 'max-w-6 max-h-6'
    }

    const paddingClasses = {
        'xs': 'p-0',
        'sm': 'p-0',
        'md': 'p-0',
        'lg': 'p-0',
        'xl': 'p-0'
    }

    let iconData

    if (specialtyName) {
        iconData = getSpecialtyIcon(specialtyName)
    } else if (specialtyId && specialties) {
        iconData = getSpecialtyIconById(specialtyId, specialties)
    } else {
        return null
    }

    const iconWithSize = React.cloneElement(iconData.icon, {
        className: `${sizeClasses[size]} object-contain w-full h-full`
    })

    if (!showName) {
        return (
            <div
                className={`inline-flex items-center justify-center rounded-full ${iconData.bgColor} ${paddingClasses[size]}`}
                title={iconData.name}
            >
                {iconWithSize}
            </div>
        )
    }

    return (
        <div className="inline-flex items-center gap-2">
            <div
                className={`inline-flex items-center justify-center rounded-full ${iconData.bgColor} ${paddingClasses[size]}`}
                title={iconData.name}
            >
                {iconWithSize}
            </div>
            {showName && (
                <span className="text-sm font-medium text-gray-700 capitalize">
                    {iconData.name}
                </span>
            )}
        </div>
    )
}

export default SpecialtyIcon