import React, {Component} from 'react'
import { Tabs } from 'antd'

const TabPane = Tabs.TabPane

class TabMenu extends React.Component {
  constructor(props) {
    super(props)
    this.newTabIndex = 0
    const tabMenus = JSON.parse(localStorage.getItem('tabMenus')) || {
      key: '1',
      title: '管理平台'
    }
    this.state = {
      isCreated: false,
      activeKey: tabMenus.key,
      panes: [{...tabMenus, content: props.children}]
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.newTab.key !== this.props.newTab.key) {
      const newTab = {...nextProps.newTab}
      const { panes } = this.state

      if(panes.find(cur => cur.key === newTab.key)) {
        this.setState({ activeKey: newTab.key, isCreated: false })
      } else {
        panes.push({...newTab, content: nextProps.children})
        this.setState({ panes, activeKey: newTab.key, isCreated: true })
      }
    }
    return true
  }

  onChange(activeKey) {
    this.setState({ activeKey, isCreated: false })
  }

  onEdit = (targetKey, action) => {
    this[action](targetKey)
  }

  add() {
    const panes = this.state.panes
    const activeKey = `newTab${this.newTabIndex++}`
    panes.push({ title: 'New Tab', content: 'Content of new Tab', key: activeKey })
    this.setState({ panes, activeKey })
  }

  remove(targetKey) {
    let { activeKey, panes } = this.state
    let lastIndex
    panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1
      }
    })
    console.log(activeKey, targetKey);
    panes = panes.filter(pane => pane.key !== targetKey)
    if (lastIndex >= 0 && activeKey === targetKey) {
      activeKey = panes[lastIndex].key
    }
    this.setState({ panes, activeKey })
  }

  render() {
    const { newTab, children } = this.props
    const { panes, activeKey, isCreated } = this.state

    return (
      <Tabs
        hideAdd
        animated={false}
        onChange={::this.onChange}
        activeKey={activeKey}
        type="editable-card"
        onEdit={::this.onEdit}
      >
      {panes.map((pane, index) => (
        <TabPane tab={pane.title} key={pane.key} closable={pane.closable}>
          {React.cloneElement((isCreated || index === panes.length - 1) ? children : panes[index + 1].content, { curPowers: newTab.curPowers, key: location.pathname })}
        </TabPane>
      ))}
      </Tabs>
    );
  }
}

export default TabMenu
