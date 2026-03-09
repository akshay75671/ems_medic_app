import { observable, action, decorate } from 'mobx';

export default class Resource {
  resource: any[] = [
    {
      epcrNum: '122',
      eventID: 'ipl2020',
      assistUserID: '5325',
      item: [
        { key: 'bandAid', lable: 'Band Aid', value: 3 },
        { key: 'syring', lable: 'Syring', value: 9 },
        { key: 'nebulizer', lable: 'Nebulizer', value: 5 },
      ],
    },
  ];

  setResourceData = (data, addValue) => {
    let found = false
    if (this.resource.length === 0) {
      this.resource.push(data);
    }
    else {
      this.resource.forEach((item) => {
        if (data.assistUserID === item.assistUserID) {
          data.item.forEach((edtvalue) => {
            found = false
            item.item.map((unit) => {
              if (unit.key === edtvalue.key) {
                addValue === true ?
                  unit.value = edtvalue.value : unit.value = unit.value + edtvalue.value
                found = true
              }
            })
            if (!found)
              item.item.push(edtvalue)
          });
        }
      })
    }
  };
  getResourceData = (assistID) => {
    let resourceObj = {};
    this.resource.forEach((item, index) => {
      if (item.assistUserID == assistID)
        resourceObj = item;
    })
    return resourceObj;
  }

  deleteResourceData = () => {
    console.log('in delete');
    this.resource = ([])
  }

  reset = () => { };
}

decorate(Resource, {
  resource: observable,
  setResourceData: action,
});
