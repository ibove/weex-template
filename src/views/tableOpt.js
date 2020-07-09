import comOpt from '@/const/comTabOpt';

export const tableOption = {
    ...comOpt,
    menuWidth: 100,
    selection: true,
    rowKey: "id",
    border: false,
    type: 'rowMargin',
    align: 'center',
    
    column: [
        {
            label: '抽检编码',
            prop: 'name',
            align: 'left'

        }, {
            label: '抽检时间',
            prop: 'time',
            align: 'center'

        }, {

            label: '抽检产品数',
            prop: 'productTotal',
            slot: true

        },
        {
            label: '合格数',
            prop: 'count'

        },
        {

            label: '不良数',
            prop: 'badCount'
        },
        {

            label: '状态',
            prop: 'status',
            dicData: [{
                name: "正常",
                value: "10"
            }, {
                name: "失效",
                value: "20"
            }, {
                name: "准备中",
                value: "30"
            }],
            props: {
                label: 'name',
                value: 'value'
            }

        }, {

            label: "创建时间",
            prop: "createTime"

        }


    ]
};
