import { LoaderFunction, redirect } from '@remix-run/node'

export const loader: LoaderFunction = ({ request, params }) => {
    const { day, month, year } = params
    // get timezone from 'tz' param in url or default to UTC
    const url = new URL(request.url)
    const timezone = url.searchParams.get('tz') || 'UTC'

    // get current day month year according to timezone
    new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
    }).formatRange(new Date(), new Date())
    const now = new Date()
    const _day = day ?? now.getDate()
    const _month = month ?? now.getMonth() + 1
    const _year = year ?? now.getFullYear()

    // redirect to url with timezone param

    if (day !== _day || month !== _month || year !== _year) {
        return redirect(`/calendar/week/${_day}/${_month}/${_year}`)
    }

    return null
}
