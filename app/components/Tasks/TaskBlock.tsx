import { Well } from '../styledParts/Well'
import { FlexContainer } from '../styledParts/FlexContainer'
import { Diminished, OneLine, Small } from '../styledParts/Text'
import { TaskWithListTitle } from '~/services/task.server'
import { StyledLink } from '../styledParts/Links'

export const TaskBlock = ({ task }: { task: TaskWithListTitle }) => {
    return (
        <Well key={task.id}>
            <FlexContainer
                flexDirection="column"
                alignItems="flex-start"
                justifyContent="space-between"
                gap="1em"
                fullHeight
            >
                <StyledLink
                    to={`/tasklists/${task.listId}/task/${task.id}`}
                    style={{
                        maxWidth: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                    title={task.title || ''}
                >
                    {task.title}
                </StyledLink>
                <OneLine>
                    <StyledLink to={`/tasklists/${task.listId}`}>
                        <Diminished>
                            <Small>{task.listTitle}</Small>
                        </Diminished>
                    </StyledLink>
                </OneLine>
            </FlexContainer>
        </Well>
    )
}
