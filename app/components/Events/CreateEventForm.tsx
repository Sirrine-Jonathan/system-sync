import { useCallback, useState } from "react";
import styled from "@emotion/styled";
import { useFetcher } from "@remix-run/react";
import { StyledForm } from "../styledParts/Form";
import { useTimezone } from "~/hooks/useTimezone";

const StyledCreateEventForm = styled(StyledForm)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: transparent;
`;

export const CreateEventForm = () => {
  const [startDate, setStartDate] = useState(new Date());
  const fetcher = useFetcher();
  const { tzFromUrl } = useTimezone();

  const handleCreateEventSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetcher.submit(e.currentTarget, {
      method: "post",
      action: `/calendar/event/create?tz=${tzFromUrl}`,
    });
  };

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    setStartDate(date);
  };

  const getEndDefault = useCallback(() => {
    const end = new Date(startDate);
    const minutes = 30;
    end.setMinutes(end.getMinutes() + minutes);
    return end.toISOString().slice(0, 16);
  }, [startDate]);

  return (
    <StyledCreateEventForm state={fetcher.state}>
      <fetcher.Form method="post" onSubmit={handleCreateEventSubmit}>
        <label htmlFor="summary">
          Summary
          <textarea
            id="summary"
            name="summary"
            placeholder="Summary"
            required
          />
        </label>
        <label htmlFor="description">
          Description
          <textarea
            id="description"
            name="description"
            placeholder="Description"
          />
        </label>
        <label htmlFor="startDateTime">
          Start Time
          <input
            type="datetime-local"
            id="startDateTime"
            name="startDateTime"
            defaultValue={startDate.toISOString().slice(0, 16)}
            onChange={handleStartChange}
            required
          />
        </label>
        <label htmlFor="endDateTime">
          End Time
          <input
            type="datetime-local"
            id="endDateTime"
            name="endDateTime"
            defaultValue={getEndDefault()}
            required
          />
        </label>
      </fetcher.Form>
    </StyledCreateEventForm>
  );
};
