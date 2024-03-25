/**
*@NApiVersion 2.x
*@NScriptType ClientScript
*/

/* Pageinit
UseCase:-To set default values in Purchase Order record */

define(['N/currentRecord'],
function (currentRecord){
	function srPageInit(context){
		var currentRec = context.currentRecord;
		currentRec.setValue({fieldId: entity, value: 629});
		currentRec.setValue({fieldId: memo, value: 'SR - PO Transaction'});
	}
	
	return{
		pageInit: srPageInit
	};
})

/* SaveRecord
UseCase:-Before save of record to validate some fields in Purchase Order*/

define(['N/currentRecord'],
function (currentRecord){
	function srSaveRecord(context){
		var currentRec = context.currentRecord;
		var poMemo = currentRec.getValue({fieldId: 'memo'});
		if(poMemo){
			return true;
		}
		else{
			alert('Please ensure that Memo field is not empty.');
			return false;
		}
	}
	
	return{
		saveRecord: srSaveRecord
	};
})

/* ValidateField
Usecase:-Validation of Field to limit the charater length in Purchase Order*/

define(['N/currentRecord'],
function(currentRecord){
	function srValidateField(context){
		var current_record = context.currentRecord;
		var field_id = context.fieldId;
		if(field_id == 'memo'){
			var data = current_record.getValue({fieldId:'memo'});
			if(data.length > 10){
				return true;
			}
			else{
				alert("Data is less than 10 char. Please ensure it's more than 10 char.");
				//return false;
			}
			return true;
		}		
	}
	return{
		validateField: srValidateField
	};
})


/* FieldChange
Usecase:- When Vendor is changed then source the text into memo field. */

define(['N/currentRecord', 'N/record'],
function(currentRecord, record){
	function srFieldChange(context){
		var currentRecord = context.currentRecord;
		var field_id = context.fieldId;
		if(field_id == 'entity'){
			var poVendor = currentRecord.getValue({fieldId: 'entity'});
			var vendorRecord = record.load({type: 'VENDOR', id: poVendor});
			var vendorEmail = vendorRecord.getValue({fieldId: 'email'});
			currentRecord.setValue({fieldId: 'memo', value: vendorEmail});
		}
	}
	return{
		fieldChanged: srFieldChange
	};
})

/* LineInit
Usecase:-Line Init when line Triggers just like page init in Purchase Order */

define(['N/record'],
function(record){
	function srLineInit(context){
		var current_record = context.currentRecord;
		var sublist_id = context.sublistId;
		if(sublist_id == 'item'){
			current_record.setCurrentSublistValue({sublistId: 'item', fieldId: 'item', value: 118});
			current_record.setCurrentSublistValue({sublistId: 'item', fieldId: 'rate', value: 200});
		}
	}
	return{
		lineInit: srLineInit
	};
})

/* ValidateLine
TriggerPoint:- Triggers onclick of Add Button in sublist level (or) line level
Usecase:-If rate is  greater than 300 we can restrict line to add in Purchase Order Sublist */
define(['N/record'],
    function(record) {
        function srValidLine(context) {
            var current_Rec = context.currentRecord;
            var itemSubId = context.sublistId;
            var field_id = context.fieldId;
            if (itemSubId == 'item') {
                var itemName = current_Rec.getCurrentSublistValue({sublistId: 'item',fieldId: 'item'});
                var itemAmount = current_Rec.getCurrentSublistValue({sublistId: 'item',fieldId: 'amount'});
                if (itemAmount > 300) {
                    return true;
                } else {
                    alert("Item Rate should be greater than 300");
                    return false;
                }
            }
        }
        return {
            validateLine: srValidLine
        };
    });

/* ValidateLine
Usecase:-If a particular item is selected the quantity is automatically sourced in Purchase Order. */	
	
define(['N/record'],
    function(record) {
        function srPostSourcing(context) {
            var current_Rec = context.currentRecord;
            var itemSubId = context.sublistId;
            var field_id = context.fieldId;
            if (itemSubId == 'item') {
                var itemName = current_Rec.getCurrentSublistValue({sublistId: 'item',fieldId: 'item'});
                //var itemAmount = current_Rec.getCurrentSublistValue({sublistId: 'item',fieldId: 'amount'});
                if (itemName == 106) {
                    current_Rec.setCurrentSublistValue({sublistId: 'item', fieldId: 'quantity', value: 50});
                }
            }
        }
        return {
            postSourcing: srPostSourcing
        };
    });