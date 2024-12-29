import styled from "@emotion/styled";
import { useFetcher } from "@remix-run/react";
import { StyledForm } from "../styledParts/Form";
import { useTimezone } from "~/hooks/useTimezone";
import { StyledButton } from "../styledParts/Buttons";
import { useState } from "react";
import { tasks_v1 } from "googleapis";

const StyledCreateTaskForm = styled(StyledForm)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: transparent;
`;

export const CreateTaskForm = ({
  lists,
  onSubmit,
}: {
  lists?: tasks_v1.Schema$TaskList[];
  onSubmit?: () => void;
}) => {
  const [listId, setListId] = useState("");
  const fetcher = useFetcher();
  const { tzFromUrl } = useTimezone();

  const handleCreateEventSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetcher.submit(e.currentTarget, {
      method: "post",
      action: listId
        ? `/tasklists/${listId}/new?tz=${tzFromUrl}`
        : `/task/new?tz=${tzFromUrl}`,
    });
    onSubmit?.();
  };

  return (
    <StyledCreateTaskForm state={fetcher.state}>
      <fetcher.Form onSubmit={handleCreateEventSubmit}>
        <label htmlFor="title">
          Title
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Title"
            required
          />
        </label>
        {lists && lists.length > 0 && (
          <label htmlFor="listId">
            List
            <select
              id="listId"
              name="listId"
              onChange={(e) => setListId(e.target.value)}
              required
            >
              <option value="">Select a list</option>
              {lists
                .filter((list) => Boolean(list.id))
                .map((list) => (
                  <option key={list.id} value={list.id}>
                    {list.title}
                  </option>
                ))}
            </select>
          </label>
        )}
        <label htmlFor="dueDate">
          Due Date
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            defaultValue={new Date().toISOString().split("T")[0]}
            required
          />
        </label>
        <label htmlFor="notes">
          Notes
          <textarea id="notes" name="notes" placeholder="Notes" />
        </label>
        <StyledButton type="submit">Create</StyledButton>
      </fetcher.Form>
    </StyledCreateTaskForm>
  );
};
