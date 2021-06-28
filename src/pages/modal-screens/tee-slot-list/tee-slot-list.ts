import { TeeTimeSlot, TeeTimeSlotDisplay, ClubCourseData } from './../../../data/mygolf.data';
import {Component} from "@angular/core";
import {ViewController, NavParams, ToastController, Platform} from "ionic-angular";
import { CourseInfo, CourseHoleInfo } from "../../../data/club-course";
import { ClubFlightService } from "../../../providers/club-flight-service/club-flight-service";
import { TeeTimeBooking } from "../../../data/mygolf.data";


import * as moment from "moment";
import { MessageDisplayUtil } from '../../../message-display-utils';
/**
 * Created by ashok on 19/12/16.
 */
@Component({
    templateUrl: 'tee-slot-list.html',
    selector: 'tee-slot-list-page'
})
export class TeeSlotListModal
{

    courses: Array<CourseInfo>;
    clubId: number;
    forDate: string;
    isClub: boolean = false;
    courseId: number;
    teeSlot: Array<TeeTimeSlotDisplay>;
    startCourses: Array<ClubCourseData>;
    changeType: string;
    currentSlot: TeeTimeBooking;
    color: string;
    currentTime: string;

    constructor(private viewCtrl: ViewController,
        private flightService: ClubFlightService,
        private navParams: NavParams,
        private toastCtl: ToastController,
        private platform: Platform) {
        this.courses = navParams.get("courses");
        this.clubId = navParams.get("clubId");
        this.forDate = navParams.get("forDate");
        this.courseId = navParams.get("courseId");
        this.changeType = navParams.get("changeType");
        this.currentSlot = navParams.get("currentSlot")
        if(this.changeType && this.changeType ==='slot') this.isClub = false;
        else if(this.changeType && this.changeType === 'course') this.isClub = true;

    }

    ionViewDidLoad() {
        this.getTeeTimeBookingList();
    }
    close(){
        this.viewCtrl.dismiss();
    }
    selectHole(hole: CourseHoleInfo, whichNine: number) {
        this.viewCtrl.dismiss({
            hole     : hole,
            whichNine: whichNine
        });
    }

    getTeeTimeBookingList() {
        let _clubCourseId;
        this.startCourses = []
        // let _courseId;
        // _courseId = this.courseId;
        _clubCourseId = this.isClub?this.clubId:this.courseId
        this.flightService.getTeeTimeSlot(this.forDate,this.isClub,_clubCourseId)
        .subscribe((data: Array<TeeTimeSlotDisplay>)=>{
            this.teeSlot = data;
            if(this.changeType === 'course') {
                this.teeSlot = this.teeSlot.filter((tee: TeeTimeSlotDisplay)=>{
                    return tee.slot.teeOffTime === this.currentSlot.slotAssigned.teeOffTime && tee.slot.startCourse.id !== this.currentSlot.slotAssigned.startCourse.id
                })
            } else {
                this.teeSlot = this.teeSlot.filter((tee: TeeTimeSlotDisplay)=>{
                    return tee.slot.teeOffTime !== this.currentSlot.slotAssigned.teeOffTime 
                    // && (tee.slot.teeOffDate === moment().toDate() && (moment(tee.slot.teeOffTime,'HH:mm:ss').format('HH:mm') >= moment().format('HH:mm')))
                })
            }
            

            this.teeSlot.forEach((t: TeeTimeSlotDisplay)=>{
                this.startCourses.push(t.slot.startCourse);
            })

            this.startCourses = this.getUnique(this.startCourses,'id')
            this.startCourses.sort((a,b)=>{
                if(a.displayOrder < b.displayOrder) return -1
                if(a.displayOrder > b.displayOrder) return 1
                else 0
            })

            
            
            console.log("change - ", this.changeType)
            console.log("tee time booking slot ", this.teeSlot,this.startCourses)
        })
    }

    getUnique(arr, comp) { 

        // store the comparison  values in array
        const unique =  arr.map(e => e[comp])
        
                // store the indexes of the unique objects
                .map((e, i, final) => final.indexOf(e) === i && i)
        
                // eliminate the false indexes & return unique objects
                .filter((e) => arr[e]).map(e => arr[e]);
        
        return unique;
        }


        changeSlot(slot: TeeTimeSlotDisplay, type?: string) {
            console.log("new slot ", slot)
            if(!slot.available && type === 'slot') return false;
            // && type === 'course'
            this.flightService.getBookingFlightList(this.clubId, moment(slot.slot.teeOffDate).format('YYYY-MM-DD'), true)
            .subscribe((data)=>{
                console.log("get slot",data)
                let _flightList: Array<TeeTimeBooking>
                let _hasFlight: Array<TeeTimeBooking>;
                if(data) {
                    _flightList = data.flightList;
                    _hasFlight = _flightList.filter((t: TeeTimeBooking)=>{
                        return (t.slotAssigned.slotNo === slot.slot.slotNo) && (t.slotAssigned.slotDayId === slot.slot.slotDayId) 
                    })

                    
                }
                if(_hasFlight && _hasFlight.length > 0) {
                        
                    console.log("has flight length", _hasFlight)
                    if(_hasFlight[0].flight && _hasFlight[0].flight.status === 'PlayFinished') {
                        console.log("flight finished")
                        MessageDisplayUtil.showMessageToast('There is Finished Flight in this slot. Please choose different slot.', 
                        this.platform , this.toastCtl,3000, "bottom");
                        return false;
                    } else {
                        this.viewCtrl.dismiss({
                            newSlot: slot,
                            currentSlot: this.currentSlot
                        });
                    }
                    
                } else {
                    this.viewCtrl.dismiss({
                        newSlot: slot,
                        currentSlot: this.currentSlot
                    });
                }
                console.log("has flight", _hasFlight)
            })
            // if(1) return false;
            
        }
        // changeSlot(slot: TeeTimeSlotDisplay) {
        //     console.log("new slot ", slot)
        //     if(!slot.available) return false;
        //     this.viewCtrl.dismiss({
        //         newSlot: slot,
        //         currentSlot: this.currentSlot
        //     });
        // }

        getSlotDetails(slot: TeeTimeSlotDisplay ,attribute: string) {
            switch(attribute) {
                case 'time':
                    let _time = moment(slot.slot.teeOffTime,'HH:mm:ss').format('hh:mm A');
                    return _time;
            }
        }

        getCurrentSlotDetails(attribute) {
            switch(attribute) {
                case 'time':
                    let _time = moment(this.currentSlot.slotAssigned.teeOffTime,'HH:mm:ss').format('hh:mm A');
                    return _time;
                case 'courseName':
                    let _courseName = this.currentSlot.slotAssigned.startCourse.name;
                    return _courseName;
            }
        }

        getSlotClass(slot: TeeTimeSlotDisplay) {
            // if(slot.available) this.color = 'danger';
            // else this.color = 'primary'

            if(this.changeType === 'course') return 'slot-available'
            else {
                // return this.color
                if(slot.available) return 'slot-available';
                else return 'slot-not-available'
            }
        }
}
