import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)


export const formatDatetime = (created_at: string) => {
  return dayjs.utc(created_at).tz('Asia/Tokyo').format('YYYY/MM/DD HH:mm')
}