import {observable, action, decorate} from 'mobx';

interface medicineItemType {
  id: string;
  medicineName: string;
  medicineQuantity: number;
  medicineType: string;
  selected: boolean;
}
interface medicineType {
  assistUserID?: string;
  medicineList?: medicineItemType[];
  medicSignature?: string;
  note?: string;
  dateAndTime?: string;
}
export default class Safeguard {
  safeguards: any[] = [
    {
      assistUserID: '3256',
      medicineList: [
        {
          id: 'medicine_Row_1',
          selected: false,
          medicineName: 'test',
          medicineQuantity: '1',
          medicineType: 'sheet',
        },
        {
          id: 'medicine_Row_2',
          selected: false,
          medicineName: 'test1',
          medicineQuantity: '1',
          medicineType: 'patch',
        },
        {
          id: 'medicine_Row_3',
          selected: false,
          medicineName: 'test2',
          medicineQuantity: '1',
          medicineType: 'card',
        },
      ],
      medicSignature: 'profiles_sign_40RZhyaeT8fl2pLlAVSJ1zKl3Yq2',
      note:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    },
  ];
  getMedicineObjByID = (assistID) => {
    let safeguardObj: medicineType = {};
    this.safeguards.forEach((item, index) => {
      if (item.assistUserID == assistID) safeguardObj = item;
    });
    return safeguardObj;
  };
  addMedicine = (assistID, medicine: medicineItemType, callBack) => {
    let medicineObj = this.getMedicineObjByID(assistID);
    if (Object.keys(medicineObj).length > 0) {
      medicineObj.medicineList.push(medicine);
    } else {
      let tempObj = {assistUserID: assistID, medicineList: []};
      tempObj.medicineList.push(medicine);
      this.safeguards.push(tempObj);
    }
    callBack();
  };
  updateMedicine = (assistID, medicine: medicineItemType, callBack) => {
    let medicineObj = this.getMedicineObjByID(assistID);
    if (Object.keys(medicineObj).length > 0) {
      medicineObj.medicineList.forEach((item, index) => {
        if (item.id == medicine.id) {
          item.medicineName = medicine.medicineName;
          item.medicineQuantity = medicine.medicineQuantity;
          item.medicineType = medicine.medicineType;
          item.selected = medicine.selected;
        }
      });
    }
    callBack();
  };
  getMedicine = (assistID) => {
    let medicineObj: any = this.getMedicineObjByID(assistID);
    let tempArr: any[] = [];
    if (Object.keys(medicineObj).length > 0) {
      if (medicineObj.hasOwnProperty('medicineList'))
        tempArr = medicineObj.medicineList;
    }
    return tempArr;
  };

  deleteMedicine = (assistID) => {
    let arr = this.safeguards.forEach((item) => {
      if (item.assistUserID === assistID) {
        item.medicineList = item.medicineList.filter(
          (unit) => unit.selected != true,
        );
      }
    });
    return arr;
  };
  pasteMedicine = (assistID, list, value, pastevalue, callBack) => {
    let found = false;
    let arr = this.safeguards.forEach((item) => {
      if (item.assistUserID.includes(assistID)) {
        list.forEach((unit) => {
          found = false;
          item.medicineList.forEach((element) => {
            if (
              element.medicineName === unit.medicineName &&
              element.medicineType === unit.medicineType
            ) {
              callBack();
              found = true;
            }
          });
          if (!found && unit.selected === true) {
            if (value === false) {
              this.deleteMedicine(pastevalue);
            }
            this.deleteMedicine(assistID);
            item.medicineList.push({
              id: 'medicine_Row_' + (item.medicineList.length + 1),
              selected: false,
              medicineName: unit.medicineName,
              medicineQuantity: unit.medicineQuantity,
              medicineType: unit.medicineType,
            });
          }
        });
      }
    });
    return arr;
  };

  setAllIdList = (list) => {
    if (this.safeguards.length === 0) {
      let newList = list.forEach((element) => {
        this.safeguards.push({
          assistUserID: element,
          medicineList: [],
        });
      });
      return newList;
    }
  };

  editNotenTime = (note) => {
    let found = false;
    let err = this.safeguards.forEach((item) => {
      found = true;
      if (!found) item.note = note;
      // item.dateAndTime.push(dnt)
    });
    console.log('err', err);
    return err;
  };

  reset = () => {};
}

decorate(Safeguard, {
  safeguards: observable,
  addMedicine: action,
  getMedicine: action,
  updateMedicine: action,
  reset: action,
  pasteMedicine: action,
  editNotenTime: action,
});
