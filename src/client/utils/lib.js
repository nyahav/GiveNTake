import { differenceInMinutes, differenceInHours, differenceInDays, isToday, isTomorrow, isYesterday } from 'date-fns'

export const getFormData = (dataObject, fileListPropertyName) => {
  const formData = new FormData()
  const dataObjectClone = { ...dataObject }
  const fileList = dataObjectClone[fileListPropertyName]

  //add attachments only if they exist
  if (!!fileList?.length) {
    for (const item of fileList) {
      formData.append('attachment', item, item.name)
    }
  }

  // delete file property from the object
  delete dataObjectClone[fileListPropertyName]

  //append all other properties
  formData.append('json', JSON.stringify(dataObjectClone))

  return formData
}

// Function to check if the input is an object
function isObject(input) {
  return input && typeof input === 'object' && input.constructor === Object
}

// Example objects
// const obj1 = { a: null, b: undefined, c: null };    // true
// const obj2 = {};                                    // true
export function isObjectEmpty(obj) {
  if (!obj) return true
  return Object.keys(obj).length === 0 ? true : Object.values(obj).every(val => val == null)
}

export function getRelativeTime(inputDate) {
  const now = new Date()
  const date = new Date(inputDate)

  // Ensure input date is valid
  if (isNaN(date)) {
    return 'Invalid date'
  }

  // Calculate the difference in minutes, hours, and days
  const diffInMinutes = differenceInMinutes(date, now)
  const diffInHours = differenceInHours(date, now)
  const diffInDays = differenceInDays(date, now)

  // Determine relative time
  if (isToday(date)) {
    if (diffInMinutes === 0) {
      return 'Right now'
    } else if (diffInMinutes > 0 && diffInMinutes <= 59) {
      return diffInMinutes === 1 ? '1 minute from now' : `${diffInMinutes} minutes from now`
    } else if (diffInMinutes > 59) {
      return diffInHours === 1 ? '1 hour from now' : `${diffInHours} hours from now`
    } else if (diffInMinutes < 0 && diffInMinutes >= -59) {
      return diffInMinutes === -1 ? '1 minute ago' : `${-diffInMinutes} minutes ago`
    } else {
      return diffInHours === -1 ? '1 hour ago' : `${-diffInHours} hours ago`
    }
  } else if (isTomorrow(date)) {
    return 'Tomorrow'
  } else if (isYesterday(date)) {
    return 'Yesterday'
  } else if (diffInDays === 1) {
    return '1 day from now'
  } else if (diffInDays === -1) {
    return '1 day ago'
  } else if (diffInDays > 0) {
    return `${diffInDays} days from now`
  } else {
    return `${-diffInDays} days ago`
  }
}

export const calculateTimeAgo = createdAt => {
  const currentDate = new Date()
  const postDateTime = new Date(createdAt)

  let timeDifference = currentDate.getTime() - postDateTime.getTime()
  if (timeDifference < 0) timeDifference = 0

  const seconds = Math.floor(timeDifference / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  let timeAgoString = ''
  if (days > 0) {
    timeAgoString = `${days} day${days > 1 ? 's' : ''} ago`
  } else if (hours > 0) {
    timeAgoString = `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else if (minutes > 0) {
    timeAgoString = `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  } else if (seconds > 0) {
    timeAgoString = `${seconds} second${seconds > 1 ? 's' : ''} ago`
  } else {
    timeAgoString = 'Now'
  }

  return timeAgoString
}
