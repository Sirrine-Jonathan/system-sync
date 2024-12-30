import { TaskWithListTitle } from '~/services/task.server'
import styled from '@emotion/styled'
import { useFetcher } from '@remix-run/react'

const Toggle = styled.label<{ submitting: boolean; completed: boolean }>`

  button[type="submit"]:hover {
    --background: ${({ completed }) => (completed ? 'transparent' : 'var(--accent-color)')};
    --submitting-background: var(--color-white);
    background: ${({ submitting }) => (submitting ? 'var(--submitting-background)' : 'var(--background)')};
  }

  button[type="submit"] {
    --background: ${({ completed }) => (completed ? 'var(--accent-color)' : 'transparent')};
    --submitting-background: var(--color-white);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 100px;
    background: ${({ submitting }) => (submitting ? 'var(--submitting-background)' : 'var(--background)')};
    cursor: pointer;
    border: 3px solid var(--color-white);
    position: relative;
    transition: background 0.2s ease-in-out;

    &:active, &:focus {
      background: ${({ submitting }) => (submitting ? 'var(--submitting-background)' : 'var(--background)')};
    }

    img {
      width: 1rem;
      max-width: unset;

    ${(props) => props.submitting && `animation: spin 1s linear infinite;`}   
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`

export const ToggleTaskCheckbox = ({ task }: { task: TaskWithListTitle }) => {
    const fetcher = useFetcher()
    const completed = task.status === 'completed'
    const submitting =
        fetcher.state === 'submitting' || fetcher.state === 'loading'

    let imgSrc: string | null = null
    if (completed) {
        imgSrc = '/icons/check-dark.svg'
    }

    if (submitting) {
        imgSrc = '/icons/loading-dark.svg'
    }

    return (
        <Toggle submitting={submitting} completed={completed}>
            <fetcher.Form
                method="post"
                action={`/tasklists/${task.listId}/task/${task.id}/toggle`}
            >
                <button type="submit" disabled={submitting}>
                    {imgSrc && <img src={imgSrc} alt="" />}
                </button>
            </fetcher.Form>
        </Toggle>
    )
}
