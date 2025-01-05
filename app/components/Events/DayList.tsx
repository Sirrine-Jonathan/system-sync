import { calendar_v3 } from 'googleapis'
import { FlexContainer } from '../styledParts/FlexContainer'
import { Event } from './Event'
export const DayList = ({
    todayEvents,
}: {
    todayEvents: calendar_v3.Schema$Event[]
}) => {
    return (
        todayEvents.length > 0 && (
            <div>
                <FlexContainer
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <h2>Events</h2>
                    <div>{new Date().toLocaleDateString()}</div>
                </FlexContainer>
                <FlexContainer
                    flexDirection="column"
                    gap="1em"
                    alignItems="stretch"
                >
                    {todayEvents.map((event) => (
                        <Event
                            key={event.id}
                            event={event}
                            calloutDirection="left"
                        />
                    ))}
                </FlexContainer>
                <hr />
            </div>
        )
    )
}
