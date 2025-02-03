import { useState, ReactNode } from 'react'

export const SwipeTabs = ({ children }: { children: ReactNode }) => {
    if (!Array.isArray(children)) {
        children = [children]
    }
    const [activeTab, setActiveTab] = useState(children[0].props.title)

    const handleTabClick = (tabTitle: string) => {
        setActiveTab(tabTitle)
    }

    return <div className="swipeTabs">{children}</div>
}

const Tab = ({ title, children }: { title: string; children: ReactNode }) => {
    return (
        <div className="swipeTab" data-tab={title}>
            {children}
        </div>
    )
}

SwipeTabs.Tab = Tab
