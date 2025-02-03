import React, { useEffect, useState } from 'react'
import AdmissionCard from '../../../components/AdmissionCard'
import StatusTrackerTest from '../../../components/StatusTrackerTest'
import useAdmissionStore from '../../../store/admission/useAdmissionStore'
import useWatchBreakpoints from '../../../hooks/useWatchBreakPoints'

const Admissions = ({
  admissions,
  selectedAdmission,
setSelectedAdmission,
selectedIndex,
setSelected
}) => {

  const isLg = useWatchBreakpoints("1024")

  const {setCurrentAdmissionId} = useAdmissionStore()

  const handleSelectedAdmission = (item, selectedIndex) => {
    console.log("SELECTION HAPPEN HERE ")
    console.log(selectedIndex)
    console.log(item.admission_id)
    setCurrentAdmissionId(item.admission_id)
    setSelected(selectedIndex)
    setSelectedAdmission(item)
  }



  useEffect(() => {
    if (admissions.length > 0) {
      setSelectedAdmission(admissions[0]); // Default to the first admission
      setSelected(0);
      setCurrentAdmissionId(admissions[0].admission_id); // Update the global store
    }
  }, [admissions, setCurrentAdmissionId])

  useEffect(() => {
    if (isLg) {
      setSelectedAdmission(admissions[0]); // Default to the first admission
      setSelected(0);
      setCurrentAdmissionId(admissions[0].admission_id); // Update the global store
    }
  }, [isLg])

  return (
    // Admission Content Container
    <div className='flex min-w-full max-w-full h-full lg:h-[85vh] justify-center xl:justify-between'>
      {/* Left Side: Admission Cards */}
      {(!selectedAdmission || isLg) && (
        <div className="w-full lg:w-[40%] overflow-y-auto xl:w-[50%]">
          {admissions.map((item, idx) => (
            <AdmissionCard
              key={idx}
              data={item}
              onClick={() => handleSelectedAdmission(item, idx)}
              active={idx === selectedIndex}
            />
          ))}
        </div>
      )}

      {/* Right Side admission status */}
      {selectedAdmission && (
        <div
          className={`w-auto lg:w-[60%]  xl:!w-[50%] lg:border-l lg:border-black overflow-y-auto ${
            isLg ? "block" : "absolute w-full h-full px-[2rem]"
          }`}
        >
          <StatusTrackerTest
            data={selectedAdmission || {}}
            selectedAdmissionIndex={selectedIndex}
          />
        </div>
      )}
    </div>
  )
}

export default Admissions