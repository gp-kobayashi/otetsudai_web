import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)


export const formatDatetime = (date: string | null) => {
  if (!date) return "";
  return dayjs.utc(date).tz('Asia/Tokyo').format('YYYY/MM/DD HH:mm')
}