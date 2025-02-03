import { FlexContainer } from '../styledParts/FlexContainer'
import { PieChart } from 'react-minimal-pie-chart'
import {
    TaskWithListTitle,
    type TaskListWithTasks,
} from '~/services/task.server'
import { darkenRgb, lightenRgb, getListColor } from '~/utils/color'
import styled from '@emotion/styled'
import { useEffect, useRef } from 'react'
import { GridContainer } from '../styledParts/GridContainer'
import { useIsMobile } from '~/hooks/useIsMobile'
import { List } from './List'
import { TaskRow } from './TaskRow'

const PieSettings = {
    completedColor: '#fefefe',
    needsActionColor: '#000000',
}

const StyledChart = styled.div`
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
    font-size: 0.8em;
    box-sizing: border-box;

    .charts {
        --size: min(350px, calc(50dvw + 2 * var(--horizontal-padding)));
        margin: 10px;
        position: relative;
        box-sizing: border-box;
    }

    #inner-chart {
        width: 100%;
        height: 100%;
    }

    @media (max-width: 767px) {
        flex-direction: column;

        .legend {
            font-size: 1em;
            align-self: flex-start;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            margin-bottom: 3em;
        }
    }
`

const KeyBullet = styled.span<{ backgroundColor: string }>`
    background-color: ${({ backgroundColor }) => backgroundColor};
    width: 1.2em;
    height: 1.2em;
    display: inline-block;
    border-radius: 50%;
    border: 1px solid var(--color-white);
    box-sizing: border-box;
`

const SubKeyBullet = styled(KeyBullet)`
    width: 0.8em;
    height: 0.8em;
`

type HasChildrenMaybe = Pick<HTMLElement | HTMLDivElement, 'children'>

const getAllChildren = (node: HasChildrenMaybe) => {
    const children: Element[] = []

    if (!node.children) return []

    for (let i = 0; i < node.children.length; i++) {
        children.push(node.children[i])
        children.push(...getAllChildren(node.children[i]))
    }
    return children
}

type ListWithDetails = {
    color: string
    needsActionColor: string
    completedColor: string
    needsAction: TaskListWithTasks['tasks']
    completed: TaskListWithTasks['tasks']
} & TaskListWithTasks

export const ProgressChart = ({ lists }: { lists: TaskListWithTasks[] }) => {
    const lineWidth = 20
    const chartRef = useRef<HTMLDivElement>(null)
    const { device } = useIsMobile()

    let columns = 2
    if (device === 'desktop') {
        columns = 4
    }

    const colorAugAmount = 50

    const listsWithDetails: ListWithDetails[] = lists.map((list) => {
        const rgb: [number, number, number] = list.id
            ? getListColor(list.id)
            : [0, 0, 0]
        const makeRgbString = (rgb: [number, number, number]) =>
            `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
        return {
            ...list,
            color: makeRgbString(rgb),
            completedColor: makeRgbString(darkenRgb(rgb, colorAugAmount)),
            needsActionColor: makeRgbString(lightenRgb(rgb, colorAugAmount)),
            completed: list.tasks.filter((task) => task.status === 'completed'),
            needsAction: list.tasks.filter(
                (task) => task.status === 'needsAction'
            ),
        } as ListWithDetails
    })

    useEffect(() => {
        if (chartRef.current) {
            chartRef.current.style.setProperty(
                '--completed-color',
                PieSettings.completedColor
            )
            chartRef.current.style.setProperty(
                '--needs-action-color',
                PieSettings.needsActionColor
            )
            const existingLabelRects =
                chartRef.current.querySelectorAll('svg .label-bg')
            existingLabelRects.forEach((rect) => rect.remove())
            const chartChildren = getAllChildren(chartRef.current)
            chartChildren.forEach((child) => {
                if (child.tagName === 'svg') {
                    const svgChildren = getAllChildren(child)
                    svgChildren.forEach((svgChild) => {
                        if (svgChild.tagName === 'text') {
                            const svgRect = svgChild.getBBox()
                            const circle = document.createElementNS(
                                'http://www.w3.org/2000/svg',
                                'circle'
                            )
                            circle.setAttribute(
                                'cx',
                                svgRect.x + svgRect.width / 2
                            )
                            circle.setAttribute(
                                'cy',
                                svgRect.y + svgRect.height / 2
                            )
                            circle.setAttribute('r', `5px`)
                            circle.setAttribute(
                                'fill',
                                'var(--primary-bg-dark)'
                            )
                            circle.classList.add('label-bg')
                            child.insertBefore(circle, svgChild)
                        }
                    })
                }
            })
        }
    }, [lists])

    return (
        <StyledChart ref={chartRef}>
            <FlexContainer>
                <div className="charts">
                    {/* Shows all tasks as Complete vs Incomplete */}
                    <PieChart
                        rounded
                        paddingAngle={lineWidth + 5}
                        startAngle={90 + lineWidth + 5}
                        labelPosition={0}
                        label={({ dataEntry }) =>
                            Math.round(dataEntry.percentage) > 0 &&
                            dataEntry.title !== 'Needs Action'
                                ? `${Math.round(dataEntry.percentage)}%`
                                : ''
                        }
                        radius={18}
                        lineWidth={lineWidth + 5}
                        labelStyle={{
                            fontSize: '0.8em',
                            fontWeight: 'normal',
                            fill: '#ffffff',
                        }}
                        data={[
                            {
                                title: 'Completed',
                                value: listsWithDetails.reduce(
                                    (acc, list) => acc + list.completed.length,
                                    0
                                ),
                                color: PieSettings.completedColor,
                                onClick: () => console.log('Completed'),
                            },
                            {
                                title: 'Needs Action',
                                value: listsWithDetails.reduce(
                                    (acc, list) =>
                                        acc + list.needsAction.length,
                                    0
                                ),
                                color: PieSettings.needsActionColor,
                                onClick: () => console.log('Needs Action'),
                            },
                        ]}
                    />
                    {/* Shows number of tasks for each Task List */}
                    <PieChart
                        style={{
                            position: 'absolute',
                            top: '0',
                            left: '0',
                        }}
                        rounded
                        radius={30}
                        lineWidth={lineWidth}
                        paddingAngle={lineWidth}
                        startAngle={90 + lineWidth}
                        labelPosition={88}
                        label={({ dataEntry }) =>
                            Math.round(dataEntry.percentage) > 0
                                ? `${Math.round(dataEntry.percentage)}%`
                                : ''
                        }
                        labelStyle={{
                            fontSize: '0.4em',
                            fontWeight: 'normal',
                            fill: '#ffffff',
                        }}
                        data={listsWithDetails.map((list) => ({
                            title: list.title || '',
                            value: list.tasks.length,
                            color: list.color,
                        }))}
                    />

                    {/* Shows Complete vs Incomplete for each Task List */}
                    <PieChart
                        style={{
                            position: 'absolute',
                            top: '0',
                            left: '0',
                        }}
                        rounded
                        radius={42}
                        lineWidth={lineWidth - 3}
                        labelPosition={90}
                        paddingAngle={lineWidth - 5}
                        startAngle={90 + lineWidth - 5}
                        label={({ dataEntry }) =>
                            Math.round(dataEntry.percentage) > 0
                                ? `${Math.round(dataEntry.percentage)}%`
                                : ''
                        }
                        labelStyle={{
                            fontSize: '0.4em',
                            fontWeight: 'normal',
                            fill: '#ffffff',
                        }}
                        data={listsWithDetails
                            .flatMap((list) => [
                                {
                                    title: list.title || '',
                                    value: list.completed.length,
                                    color: list.completedColor,
                                },
                                {
                                    title: list.title || '',
                                    value: list.needsAction.length,
                                    color: list.needsActionColor,
                                },
                            ])
                            .filter((list) => list.value > 0)}
                    />
                </div>
            </FlexContainer>
            <GridContainer gap="1em">
                {listsWithDetails.map((list) => (
                    <List
                        key={list.id}
                        taskList={list as TaskListWithTasks}
                        allLists={lists}
                        color={list.color}
                    >
                        {list.tasks.map((task) => (
                            <li key={task.id}>
                                <TaskRow
                                    task={task as TaskWithListTitle}
                                    showListName
                                />
                            </li>
                        ))}
                    </List>
                ))}
            </GridContainer>
        </StyledChart>
    )
}

const StyledListChart = styled.div`
    width: 35px;
`

export const ListChart = ({ list }: { list: TaskListWithTasks }) => {
    return (
        <StyledListChart>
            <PieChart
                rounded
                lineWidth={20}
                paddingAngle={25}
                startAngle={90 + 25}
                data={[
                    {
                        title: list.title || '',
                        value: list.tasks.filter(
                            (task) => task.status === 'completed'
                        ).length,
                        color: PieSettings.completedColor,
                    },
                    {
                        title: list.title || '',
                        value: list.tasks.filter(
                            (task) => task.status === 'needsAction'
                        ).length,
                        color: PieSettings.needsActionColor,
                    },
                ].filter((list) => list.value > 0)}
            />
        </StyledListChart>
    )
}
