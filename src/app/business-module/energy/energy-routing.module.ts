import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EnergyComponent } from './energy.component';
import { EnergyNodesComponent } from './energy-nodes/energy-nodes.component';
import { InsertNodesComponent } from './energy-nodes/insert-nodes/insert-nodes.component';
import { DetailsNodesComponent } from './energy-nodes/details-nodes/details-nodes.component';
import { EnergyTimedataComponent } from './energy-timedata/energy-timedata.component';
import { DataTaskComponent } from './energy-timedata/data-task/data-task.component';
import { DataTaskOperaComponent } from './energy-timedata/data-task-opera/data-task-opera.component';
import { TaskInfoComponent } from './energy-timedata/task-info/task-info.component';
import { EnergyStatisticsComponent } from './energy-statistics/energy-statistics.component';
import { ElectricStrategyComponent } from './energy-statistics/electric-strategy/electric-strategy.component';
import { ElectricStrategyInfoComponent } from './energy-statistics/electric-strategy-info/electric-strategy-info.component';
import { ElectricStrategyInsertComponent } from './energy-statistics/electric-strategy-insert/electric-strategy-insert.component';

const routes: Routes = [
    {
        path: '',
        component: EnergyComponent,
        data: {
            breadcrumb: [{ label: 'energy' }]
        },
        children: [
            {
                path: 'energy-nodes',
                data: {
                    breadcrumb: [{ label: 'energy' }, { label: 'energyNodes' }]
                },
                component: EnergyNodesComponent
            },
            // 新增能耗节点
            {
                path: 'energy-nodes/insert',
                data: {
                    breadcrumb: [
                        { label: 'energy' },
                        { label: 'energyNodes', url: '/business/energy/energy-nodes' },
                        { label: 'energyNodesInsert' }
                    ]
                },
                component: InsertNodesComponent
            },
            // 编辑 能耗节点
            {
                path: 'energy-nodes/update',
                data: {
                    breadcrumb: [
                        { label: 'energy' },
                        { label: 'energyNodes', url: '/business/energy/energy-nodes' },
                        { label: 'energyNodesUpdate' }
                    ]
                },
                component: InsertNodesComponent
            },
            // 详情 能耗节点
            {
                path: 'energy-nodes/nodes-details',
                data: {
                    breadcrumb: [
                        { label: 'energy' },
                        { label: 'energyNodes', url: '/business/energy/energy-nodes' },
                        { label: 'energyNodesDetails' }
                    ]
                },
                component: DetailsNodesComponent
            },
            // 实时数据
            {
                path: 'energy-timedata',
                data: {
                    breadcrumb: [{ label: 'energy' }, { label: 'energyTimeData' }]
                },
                component: EnergyTimedataComponent
            },
            // 数据采集任务
            {
                path: 'energy-collect',
                data: {
                    breadcrumb: [
                        { label: 'energy' },
                        { label: 'energyDataTask'}
                    ]
                },
                component: DataTaskComponent
            },
            // 采集任务新增
            {
                path: 'energy-collect/task-insert',
                data: {
                    breadcrumb: [
                        { label: 'energy' },
                        { label: 'energyDataTask', url: '/business/energy/energy-collect'},
                        { label: 'energyTaskInsert'}
                    ]
                },
                component: DataTaskOperaComponent
            },
            // 采集任务编辑
            {
                path: 'energy-collect/task-update',
                data: {
                    breadcrumb: [
                        { label: 'energy' },
                        { label: 'energyDataTask', url: '/business/energy/energy-collect'},
                        { label: 'energyTaskUpdate'}
                    ]
                },
                component: DataTaskOperaComponent
            },
            // 采集任务详情
            {
                path: 'energy-collect/task-info',
                data: {
                    breadcrumb: [
                        { label: 'energy' },
                        { label: 'energyDataTask', url: '/business/energy/energy-collect' },
                        { label: 'energyTaskInfo'}
                    ]
                },
                component: TaskInfoComponent
            },
            // 数据管理
            {
                path: 'energy-statistics',
                data: {
                    breadcrumb: [{ label: 'energy' }, { label: 'energyStatistics' }]
                },
                component: EnergyStatisticsComponent
            },
            // 电费策略
            {
                path: 'energy-statistics/electric-strategy',
                data: {
                    breadcrumb: [
                        { label: 'energy' },
                        { label: 'energyStatistics', url: '/business/energy/energy-statistics' },
                        { label: 'electricStrategy' }
                    ]
                },
                component: ElectricStrategyComponent
            },
            // 电费策略详情
            {
                path: 'energy-statistics/electric-strategy/electric-strategy-info',
                data: {
                    breadcrumb: [
                        { label: 'energy' },
                        { label: 'energyStatistics', url: '/business/energy/energy-statistics' },
                        {
                            label: 'electricStrategy',
                            url: '/business/energy/energy-statistics/electric-strategy'
                        },
                        { label: 'electricStrategyInfo' }
                    ]
                },
                component: ElectricStrategyInfoComponent
            },
            // 电费策略新增
            {
                path: 'energy-statistics/electric-strategy/electric-strategy-insert',
                data: {
                    breadcrumb: [
                        { label: 'energy' },
                        { label: 'energyStatistics', url: '/business/energy/energy-statistics' },
                        {
                            label: 'electricStrategy',
                            url: '/business/energy/energy-statistics/electric-strategy'
                        },
                        { label: 'electricStrategyInsert' }
                    ]
                },
                component: ElectricStrategyInsertComponent
            },
            // 电费策略编辑
            {
                path: 'energy-statistics/electric-strategy/electric-strategy-update',
                data: {
                    breadcrumb: [
                        { label: 'energy' },
                        { label: 'energyStatistics', url: '/business/energy/energy-statistics' },
                        {
                            label: 'electricStrategy',
                            url: '/business/energy/energy-statistics/electric-strategy'
                        },
                        { label: 'electricStrategyUpdata' }
                    ]
                },
                component: ElectricStrategyInsertComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EnergyRoutingModule {}
