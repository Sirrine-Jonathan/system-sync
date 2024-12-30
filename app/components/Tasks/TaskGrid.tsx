import { FlexContainer } from '~/components/styledParts/FlexContainer'
import { GridContainer } from '../styledParts/GridContainer'
import { StyledForm } from '~/components/styledParts/Form'
import { StyledSelect } from '~/components/styledParts/Select'
import { TaskBlock } from './TaskBlock'
import { useFetcher } from '@remix-run/react'
import { useState, useCallback, useEffect } from 'react'
import { Spinner } from '../styledParts/Spinner'
import { TaskListWithTasks } from '~/services/task.server'
import { tasks_v1 } from 'googleapis'
import { StyledIconButton } from '../styledParts/Buttons'

export const TaskGrid = ({
    collapsable = false,
}: {
    collapsable?: boolean
}) => {
    const [filterList, setFilterList] = useState('')
    const [search, setSearch] = useState('')
    const [expanded, setExpanded] = useState(true)

    const fetcher = useFetcher<{
        lists: TaskListWithTasks[]
        listsForFilter: tasks_v1.Schema$TaskList[]
    }>()
    const { lists, listsForFilter } = fetcher?.data || {}

    const refresh = useCallback(() => {
        const searchParams = new URLSearchParams()

        if (filterList) {
            searchParams.set('list', filterList)
        }

        if (search) {
            searchParams.set('search', search)
        }

        const url = `/tasklists/all?${searchParams.toString()}`
        console.log(url)
        fetcher.load(url)
    }, [filterList, search])

    useEffect(() => {
        refresh()
    }, [refresh])

    const updateSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        // debounce
        const timeout = setTimeout(() => {
            setSearch(e.target.value)
        }, 500)
        return () => clearTimeout(timeout)
    }

    const totalLists = lists?.length
    const totalTasks = lists?.reduce(
        (total, list) => total + list.tasks.length,
        0
    )
    const noResults = (lists && totalLists === 0) || totalTasks === 0

    return (
        <>
            <StyledForm state="idle" style={{ padding: '1rem 0' }}>
                <FlexContainer
                    justifyContent="space-between"
                    alignItems="center"
                    gap="1em"
                    fullWidth
                >
                    {expanded && (
                        <FlexContainer
                            gap="1em"
                            alignItems="center"
                            justifyContent="flex-start"
                            fullWidth
                        >
                            <label htmlFor="filterVal">
                                Search
                                <input
                                    type="text"
                                    name="search"
                                    id="search"
                                    defaultValue={search}
                                    onChange={updateSearch}
                                    placeholder="Search by title"
                                />
                            </label>
                            <label>
                                List
                                <StyledSelect
                                    name="filterList"
                                    id="filterList"
                                    defaultValue={filterList}
                                    onChange={(e) => {
                                        setFilterList(e.target.value)
                                    }}
                                >
                                    <option value="">All</option>
                                    {listsForFilter?.map((list) => (
                                        <option key={list.id} value={list.id}>
                                            {list.title}
                                        </option>
                                    ))}
                                </StyledSelect>
                            </label>
                        </FlexContainer>
                    )}
                    {!expanded && (
                        <FlexContainer gap="1em" alignItems="center">
                            Expand Tasks
                        </FlexContainer>
                    )}
                    {collapsable && (
                        <StyledIconButton
                            onClick={() => {
                                setExpanded(!expanded)
                            }}
                            size="normal"
                            style={{ alignSelf: 'flex-start' }}
                        >
                            {expanded ? (
                                <img src="/icons/minus.svg" alt="Hide tasks" />
                            ) : (
                                <img src="/icons/expand.svg" alt="Show tasks" />
                            )}
                        </StyledIconButton>
                    )}
                </FlexContainer>
            </StyledForm>
            {expanded && (
                <div>
                    {fetcher.state === 'loading' && <Loading />}
                    {fetcher.state === 'idle' && noResults && <None />}
                    {fetcher.state === 'idle' && !noResults && (
                        <GridContainer
                            templateColumns="repeat(auto-fill, minmax(min(50%, 100px), 1fr))"
                            gap="1em"
                        >
                            {lists &&
                                lists.map(({ tasks = [] }) =>
                                    tasks.map((task) => (
                                        <TaskBlock key={task.id} task={task} />
                                    ))
                                )}
                        </GridContainer>
                    )}
                </div>
            )}
        </>
    )
}

const MiddleDisplay = ({ children }: { children: React.ReactNode }) => {
    return (
        <FlexContainer
            gap="1em"
            justifyContent="center"
            fullWidth
            alignItems="center"
        >
            {children}
        </FlexContainer>
    )
}

const Loading = () => {
    return (
        <MiddleDisplay>
            <Spinner />
        </MiddleDisplay>
    )
}

const None = () => {
    return (
        <MiddleDisplay>
            <p>No tasks found</p>
        </MiddleDisplay>
    )
}
