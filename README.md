# Albany Route Planner

一个面向 Albany、Troy、Schenectady 和 Clifton Park 的小规模末端配送路线模拟网页。

## 功能

- 输入文字地址并转换为地图坐标
- 按指定线路数量进行均衡地理分区
- 使用最近邻 + 2-opt 生成优化顺序
- 生成道路路线、里程与预计时长
- 上传司机历史 CSV 并自动匹配司机与线路
- 对小样本司机表现进行收缩修正，避免偶然高分
- 综合妥投率、异常率、虚假签收率、效率和区域熟悉度
- 地图显示各线路和配送顺序
- 导出路线分配 CSV

## 使用

打开 GitHub Pages 网页，每行输入一个地址。可先下载司机历史数据模板，按模板填写并上传 CSV；设置线路数量后点击“生成路线”。

仓库模板：[`examples/driver-history-template.csv`](examples/driver-history-template.csv)

当前为验证业务流程的静态 MVP，最多处理 60 个地址。地理编码使用公共 Nominatim，路线使用公共 OSRM；真实大批量订单应迁移到本地 Valhalla/OSRM 后端。司机历史数据只在浏览器当前会话中计算。

## 数据说明

网页不会把订单写入仓库或数据库。地址会发送给公共 Nominatim 服务，坐标会发送给公共 OSRM 服务，因此请勿在演示版中使用需要保密的客户数据。
