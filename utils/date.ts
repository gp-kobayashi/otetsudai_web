import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)


export const formatDatetime = (date: string | null) => {
  if (!date) {
    return ""
  }
  const d = dayjs.utc(date)
  if (!d.isValid()) {
    return ""
  }
  return d.tz('Asia/Tokyo').format('YYYY/MM/DD HH:mm')
}