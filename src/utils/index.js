import moment from "moment";

export const InputValidateNumber = (e) => {
  e.target.value = e.target.value.replace(
    /[^0-9-]/g,
    ""
  );
}

export const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  // Adjust if the current date is before the birth date in the year
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

export const convertMilitaryToAMPM = (militaryTime) => {
  const [hours, minutes] = militaryTime.split(":").map(Number);

  // Create a Date object with the given time (assuming today's date)
  const date = new Date();
  date.setHours(hours, minutes);

  // Use toLocaleString to format the time in 12-hour AM/PM format
  const options = { hour: "numeric", minute: "numeric", hour12: true };
  return date.toLocaleString("en-US", options);
}

export const generateSchoolYears = (startYear = 2010, endYear = 2024) => {
  return Array.from({ length: endYear - startYear + 1 }, (_, i) => {
    const yearStart = startYear + i;
    const yearEnd = yearStart + 1;
    return `${yearStart}-${yearEnd}`;
  });
};

export const computeWeeks = (date) => {
  const startOfMonth = moment(date).startOf("month").toDate();
  const endOfMonth = moment(date).endOf("month").toDate();

  const weeks = [];
  let currentWeek = [];

  let day = computeFirstWorkingDay(startOfMonth);

  while (day <= endOfMonth || currentWeek.length > 0) {
    const dayOfWeek = day.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      currentWeek.push(day);
    }

    day = new Date(day);
    day.setDate(day.getDate() + 1);

    if (currentWeek.length === 5) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  return weeks;
};

export const computeFirstWorkingDay = (date) => {
  const increment = date.getDay() === 0 || date.getDay() === 6 ? 1 : -1;
  while (date.getDay() !== 1) {
    date.setDate(date.getDate() + increment);
  }
  return date;
};

export const assembleWeekEventsByName = (weekEvents) => {
  if (weekEvents.length > 0) {
    const weekEventsWithSameName = weekEvents.reduce((acc, event) => {
      if (!acc[event.user.name]) {
        acc[event.user.name] = [];
      }
      acc[event.user.name].push(event);
      return acc;
    }, {});

    return Object.values(weekEventsWithSameName);
  } else {
    return weekEvents.map((event) => [event]);
  }
};


export const handleDobChange = (e, dateOfBirth, setter, parent = null) => {
  console.log("HANDLE DOB RUNNING")
  console.log(e.target.value)
  if (!dateOfBirth && !e?.target?.value) {
    console.log("DATE OF BIRTH IS MISSING")
    return
  };

  // Use the date from personalData or fallback to the input value
  const selectedDate = new Date(dateOfBirth || e.target.value);
  const today = new Date();

  // If the selected date is invalid or in the future, reset the age
  if (isNaN(selectedDate) || selectedDate > today) {
    console.log("// If the selected date is invalid or in the future, reset the age")
    if(parent) setter("dateOfBirth", "", parent)
    else setter("dateOfBirth", "");
    return;
  }

  // Calculate age
  let age = today.getFullYear() - selectedDate.getFullYear();
  const monthDifference = today.getMonth() - selectedDate.getMonth();

  // Adjust for months and days not yet reached
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < selectedDate.getDate())
  ) {
    age--;
  }

  // Set age if valid, otherwise reset it
  console.log(age)
  console.log(dateOfBirth)
  console.log(setter)
  console.log(parent)
  if(parent) {
    setter("age", age >= 0 ? age : "", parent)
  } else {
    console.log("SETTING NOT PARENT")
    setter("age", age >= 0 ? age : "")
  }
};


export const transformText = (inputText) => {
  return inputText.replace(/ /g, '-').toLowerCase();
};