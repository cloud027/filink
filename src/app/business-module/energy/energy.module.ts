import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared-module/shared-module.module';

import { EnergyRoutingModule } from './energy-routing.module';
import { EnergyComponent } from './energy.component';
import { EnergyNodesComponent } from './energy-nodes/energy-nodes.component';
import { EnergyTimedataComponent } from './energy-timedata/energy-timedata.component';
import { EnergyStatisticsComponent } from './energy-statistics/energy-statistics.component';
import { InsertNodesComponent } from './energy-nodes/insert-nodes/insert-nodes.component';
import { ElectricStrategyComponent } from './energy-statistics/electric-strategy/electric-strategy.component';
import { ElectricStrategyInfoComponent } from './energy-statistics/electric-strategy-info/electric-strategy-info.component';
import { ElectricStrategyInsertComponent } from './energy-statistics/electric-strategy-insert/electric-strategy-insert.component';
import { BasicInfoComponent } from './energy-statistics/electric-strategy-insert/components/basic-info/basic-info.component';
import { StrategyDetailsComponent } from './energy-statistics/electric-strategy-insert/components/strategy-details/strategy-details.component';
import { DoneComponent } from './energy-statistics/electric-strategy-insert/components/done/done.component';
import { ButtonComponent } from './energy-statistics/electric-strategy-insert/components/button/button.component';
import { XcStepsComponent } from './energy-statistics/electric-strategy-insert/components/xc-steps/xc-steps.component';
import { DataTaskComponent } from './energy-timedata/data-task/data-task.component';
import { DataTaskOperaComponent } from './energy-timedata/data-task-opera/data-task-opera.component';
import { GroupComponent } from './energy-timedata/data-task-opera/components/group/group.component';
import { EquipmentComponent } from './energy-timedata/data-task-opera/components/equipment/equipment.component';
import { TabAreaorComponent } from './energy-timedata/data-task-opera/components/tab-areaor/tab-areaor.component';
import { DatePickerComponent } from './components/date-picker/date-picker.component';
import { DetailsNodesComponent } from './energy-nodes/details-nodes/details-nodes.component';
import { DetailsTabComponent } from './energy-nodes/details-nodes/details-tab/details-tab.component';
import { ExistEquipmentComponent } from './energy-nodes/insert-nodes/exist-equipment/exist-equipment.component';
import { CollectionHlComponent } from './energy-nodes/insert-nodes/collection-hl/collection-hl.component';
import { EnergyApiService } from './share/service/energy/energy-api.service';
import { EnergyUtilService } from './share/service/energy/energy-util.service';
import { CollectionTablesComponent } from './components/collection-tables/collection-tables.component';
import { AreaStylePipe } from './energy-timedata/data-task-opera/components/tab-areaor/area-style.pipe';
import { TopButtonDisablePipe } from './share/pipe/top-button-disable.pipe';
import { TaskInfoComponent } from './energy-timedata/task-info/task-info.component';
import { TaskOpeartionComponent } from './energy-timedata/task-info/component/task-opeartion/task-opeartion.component';
import { TableSearchModelComponent } from './components/table-search-model/table-search-model.component';
import { GroupApiService } from '../facility/share/service/group/group-api.service';
import { AreaTableVirtualComponent } from './components/area-table-virtual/area-table-virtual.component';
import { AreaTableHeaderComponent } from './components/area-table-virtual/components/area-table-header/area-table-header.component';
import { SerialNumberPipe } from './share/pipe/serial-number.pipe';
import { EchartColumnComponent } from './components/echart-column/echart-column.component';
import { StatisticEchartsComponent } from './energy-statistics/components/statistic-echarts/statistic-echarts.component';
import { AnalysisEchartsComponent } from './energy-statistics/components/analysis-echarts/analysis-echarts.component';
import { StatisticTableComponent } from './energy-statistics/components/statistic-table/statistic-table.component';
import { EquipmentApiService } from '../facility/share/service/equipment/equipment-api.service';
import { EnergyDatePickerSelectTagComponent } from './components/energy-date-picker-select-tag/energy-date-picker-select-tag.component';
import { FacilityApiService } from '../facility/share/service/facility/facility-api.service';
import { ProductForCommonService } from '../../core-module/api-service/product/product-for-common.service';
import { NodesStatisticComponent } from './energy-nodes/details-nodes/nodes-statistic/nodes-statistic.component';
@NgModule({
    declarations: [
        EnergyComponent,
        EchartColumnComponent,
        EnergyNodesComponent,
        EnergyTimedataComponent,
        EnergyStatisticsComponent,
        InsertNodesComponent,
        ElectricStrategyComponent,
        ElectricStrategyInfoComponent,
        ElectricStrategyInsertComponent,
        BasicInfoComponent,
        StrategyDetailsComponent,
        DoneComponent,
        ButtonComponent,
        XcStepsComponent,
        DataTaskComponent,
        DataTaskOperaComponent,
        GroupComponent,
        EquipmentComponent,
        TabAreaorComponent,
        DatePickerComponent,
        DetailsNodesComponent,
        DetailsTabComponent,
        ExistEquipmentComponent,
        CollectionHlComponent,
        CollectionTablesComponent,
        AreaStylePipe,
        TaskInfoComponent,
        TaskOpeartionComponent,
        TableSearchModelComponent,
        AreaTableVirtualComponent,
        AreaTableHeaderComponent,
        TopButtonDisablePipe,
        SerialNumberPipe,
        StatisticEchartsComponent,
        AnalysisEchartsComponent,
        StatisticTableComponent,
        EnergyDatePickerSelectTagComponent,
        NodesStatisticComponent
    ],
    imports: [CommonModule, EnergyRoutingModule, SharedModule],
    providers: [
        EnergyApiService,
        EquipmentApiService,
        EnergyUtilService,
        GroupApiService,
        FacilityApiService,
        ProductForCommonService
    ]
})
export class EnergyModule {}
