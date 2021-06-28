import { TeeTimeSlot, TeeTimeSlotDisplay, ClubCourseData, DiscountCompany, PlayerData, DiscountCompanyProgram, PlayerDiscountProgram, DiscountPlayerClub, ClubData, PlayerBookingTypeAssociation, BookingPlayerType } from './../../../../data/mygolf.data';
import {Component} from "@angular/core";
import {ViewController, NavParams, ToastController, Platform} from "ionic-angular";
import { CourseInfo, CourseHoleInfo, ClubInfo } from "../../../../data/club-course";
import { ClubFlightService } from "../../../../providers/club-flight-service/club-flight-service";
import { TeeTimeBooking } from "../../../../data/mygolf.data";


import * as moment from "moment";
import { MessageDisplayUtil } from '../../../../message-display-utils';
import { PlayerInfo } from '../../../../data/player-data';
import { NavController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { SearchDiscountCompanyModal } from '../search-discount-company/search-discount-company';
import { RecentClubListPage } from '../../../performance/recent-club/recent-club';
import { AlertController } from 'ionic-angular';
import { ProgramClubListPage } from '../program-club-list/program-club-list';
import { JsonService } from '../../../../json-util';
import { ImageData, ImageService } from '../../../../providers/image-service/image-service';
import { LoadingController } from 'ionic-angular';
import { PlayerHomeActions } from '../../../../redux/player-home';
import { ContentType } from '../../../../remote-request';
import { ImageZoom } from '../../image-zoom/image-zoom';
import { ActionSheetController } from 'ionic-angular';
/**
 * Created by ashok on 19/12/16.
 */
@Component({
    templateUrl: 'add-player-type-discount.html',
    selector: 'add-player-type-discount-page'
})
export class AddPlayerTypeDiscountModal
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
    mode: string;
    type: string;
    optionTypes: string = 'details';
    headerTitle: string;
    playerTypes: Array<any>;
    discountCards: Array<any>;
    discountCompanies: Array<DiscountCompany>;
    selectedDiscountCompany: DiscountCompany;
    cardMembershipNo: string;
    discountPrograms: Array<DiscountCompanyProgram>;
    selectedDiscountProgram: string;

    cardValidFrom: string;
    cardValidUntil: string;
    player: any; //PlayerInfo | PlayerData;
    cardMaxDate: string;

    forBooking: boolean = false;
    fromClub: boolean = false;
    playerDiscountProgram: PlayerDiscountProgram;
    pendingPDP: Array<DiscountPlayerClub> = new Array<DiscountPlayerClub>();
    temporaryImageURL: string;
    clubList: any;
    playerBookingTypeAssociation: PlayerBookingTypeAssociation;
    selectedPlayerType: BookingPlayerType;
    data: any;

    constructor(private viewCtrl: ViewController,
        private flightService: ClubFlightService,
        private navParams: NavParams,
        private toastCtl: ToastController,
        private platform: Platform,
        private modalCtrl: ModalController,
        private alertCtrl: AlertController,
        private imageService: ImageService,
        private loadingCtl: LoadingController,
        private playerHomeActions: PlayerHomeActions,
        private actionSheetCtl: ActionSheetController) {
        this.courses = navParams.get("courses");
        this.clubId = navParams.get("clubId");
        this.forDate = navParams.get("forDate");
        this.courseId = navParams.get("courseId");
        this.changeType = navParams.get("changeType");
        this.currentSlot = navParams.get("currentSlot")
        if(this.changeType && this.changeType ==='slot') this.isClub = false;
        else if(this.changeType && this.changeType === 'course') this.isClub = true;
        this.mode = navParams.get("mode");
        this.type = navParams.get("type");
        this.headerTitle = navParams.get("headerTitle");
        this.player = navParams.get("player");
        this.forBooking = navParams.get("forBooking");
        this.fromClub = navParams.get("fromClub");
        this.playerDiscountProgram = navParams.get("pdp");
        if(this.type === 'playerDiscount') this.data = navParams.get("data");
        // this.data = navParams

        this.playerTypes = [
            {
            id: "ARMY",
            name: "Armed Forces",
            use: true,
           },
           {
            id: "GOVT",
            name: "Government",
            use: true,
           },
           {
            id: "GUEST",
            name: "Member's Guest",
            use: false,
           },
           {
            id: "JUNIOR",
            name: "Junior",
            use: true,
           },
           {
            id: "MEMBER",
            name: "Club Member",
            use: true,
           },
           {
            id: "POLICE",
            name: "Police",
            use: true,
           },
           {
            id: "SENIOR",
            name: "Senior Citizen",
            use: true,
           },
           {
            id: "STAFF",
            name: "Staff",
            use: true,
           },{
            id: "TMEMBER",
            name: "Term Member",
            use: true,
           },]
        this.playerTypes.sort((a,b)=>{
            if(a.name < b.name) return -1
            else if(a.name > b.name) return 1
            else return 0
        });

        this.discountCards = [{
            id: "AGSSG 1",
            name: "Staff",
            use: true,
           },{
            id: "AGSSG 2",
            name: "Term Member",
            use: true,
           },];

           if(this.mode === 'edit') {
            this.cardValidFrom = moment(this.playerDiscountProgram.validFrom,"YYYY-MM-DD").format("YYYY-MM-DD"); // moment().format("YYYY-MM-DD");
            this.cardValidUntil = moment(this.playerDiscountProgram.validUntil,"YYYY-MM-DD").format("YYYY-MM-DD"); // moment().add(1,'months').format("YYYY-MM-DD");
            this.cardMembershipNo = this.playerDiscountProgram.membershipNumber;
            // this.cardMaxDate = this.playerDiscountProgram. moment().add(10,'years').format("YYYY-MM-DD");
           } else {
            this.cardValidFrom = moment().format("YYYY-MM-DD");
            this.cardValidUntil = moment().add(1,'months').format("YYYY-MM-DD");
           }
           this.cardMaxDate = moment().add(10,'years').format("YYYY-MM-DD");
    }

    ionViewDidLoad() {
        // this.getTeeTimeBookingList();
        if(this.mode === 'new') {
            if(this.type==='playerType') {
                this.getAssignablePlayerTypes();
            } else {
                this.getListDiscountCompanies();
            }
        } 
        if(this.mode === 'edit') {
            this.getListApplications();
            this.getRecognizedClub();
        }
        if(this.mode === 'approval') {
            this.getListApplications();
            this.getRecognizedClub();
        }
    }
    close(){
        this.viewCtrl.dismiss({
            created: false
        });
    }
    selectHole(hole: CourseHoleInfo, whichNine: number) {
        this.viewCtrl.dismiss({
            hole     : hole,
            whichNine: whichNine
        });
    }

    getRecognizedClub() {
        this.clubList = {};
        let _programId = this.playerDiscountProgram.discountProgram.id;
        this.flightService.listDiscountProgramsClub(_programId)
        .subscribe((data)=>{
            console.log("get list discount program clubs", data)
            console.log("get list discount program clubs", data.json())
            if(data) {
                let clubList = data.json();
                if(clubList.success && clubList.totalItems > 0) {
                    // this.clubList.currentPage = clubList.currentPage;
                    // this.clubList.totalPages  = clubList.totalInPage;
                    this.clubList.totalItems  = clubList.totalItems;
                    // // clubList.items.forEach((club: ClubData)=>{
                    // //     JsonService.deriveFulImageURL(club,'clubImage');
                    // //     JsonService.deriveFulImageURL(club,'clubThumbnail');
                    // //     JsonService.deriveFulImageURL(club,'clubLogo');
                    // // })
                    // this.clubList.clubs.push(...clubList.items);
                    // this.clubList.clubs.forEach((club: ClubData)=>{
                    //     JsonService.deriveFulImageURL(club,'clubImage');
                    //     JsonService.deriveFulImageURL(club,'clubThumbnail');
                    //     JsonService.deriveFulImageURL(club,'clubLogo');
                    // })
                    // console.log("get list discount program clubs", this.clubList, clubList)
                } else if(clubList.success && clubList.totalItems === 0) {
                    this.clubList.totalItems = clubList.totalItems;
                }
            } else this.clubList.totalItems = 0
        })
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

        setOptionType(type: number) {
            if (type === 1) {
                this.optionTypes = 'details';
                // this.friendScreenName = 'Search';
                // if (this.platform.is("ios") && this.platform.is("cordova")) {
                //     this.keyboard.close();
                // }
            }
            if (type === 2) {
                this.optionTypes = 'clubApprovals';
                this.getListApplications();
                // this.friendScreenName = 'My Bookings';
                // this._refreshRequest(null, null);
                // this.refreshActiveBooking();
                // if (this.platform.is("ios") && this.platform.is("cordova")) {
                //     this.keyboard.close();
                // }
            }
            if (type === 3) {
                this.optionTypes = 'voucher';
            }
    
        }

        getListDiscountCompanies() {
            this.flightService.getDiscountCompanies()
            .subscribe((data)=>{
                console.log("get list discount companies data ", data)
                if(data && data.success) {
                    this.discountCompanies = data.items;
                }
            })
        }
        onAddDiscountCard() {
            if(!this.selectedDiscountCompany) {
                MessageDisplayUtil.showMessageToast('Please select Discount Company', 
                this.platform , this.toastCtl,3000, "bottom");
                return false;
            }
            if(!this.selectedDiscountProgram) {
                MessageDisplayUtil.showMessageToast('Please select Discount Program', 
                this.platform , this.toastCtl,3000, "bottom");
                return false;
            }
            if(!this.cardMembershipNo || (this.cardMembershipNo && this.cardMembershipNo.length === 0)) {
                MessageDisplayUtil.showMessageToast('Please enter membership number', 
                this.platform , this.toastCtl,3000, "bottom");
                return false;
            }
            if(this.cardValidFrom >= this.cardValidUntil) {
                MessageDisplayUtil.showMessageToast('Please enter valid dates', 
                this.platform , this.toastCtl,3000, "bottom");
                return false;
            }
            console.log("fromClub - ", this.fromClub, ' - ', this.clubId);
            console.log("forBooking - ", this.forBooking);
            console.log("player - ", this.player);
            let _playerId = this.player.playerId?this.player.playerId:this.player.id; // | this.player.id;

            let _programId = this.selectedDiscountProgram;
            let _membershipNo = this.cardMembershipNo;
            let _clubId = this.fromClub?this.clubId:null;
            let _validFrom = moment(this.cardValidFrom).format("YYYY-MM-DD");
            let _validUntil = moment(this.cardValidUntil).format("YYYY-MM-DD");
            let _msg;
            console.log("adding player discount : ", _playerId, _programId, _membershipNo, _validFrom, _validUntil);
            this.flightService.createPlayerDiscountCard(_playerId, _programId, _membershipNo, _validFrom, _validUntil)
            .subscribe((data)=>{
                if(data) {
                    console.log("create player discount", data);
                    if(data.status === 200) {
                        let _data = data.json();
                        let _existing = false;

                        if(this.data) {
                            this.data.filter((d)=>{
                                if(d.id === _data.id) _existing = true;
                            })
                        }
                        if(_existing) _msg = 'Successfully updated card #id : '+_data.membershipNumber;
                        else _msg = 'Successfully added new card';
                        MessageDisplayUtil.showMessageToast(_msg, 
                        this.platform , this.toastCtl,3000, "bottom");
                        this.playerDiscountProgram = _data;
                        if(this.isCordova() && this.temporaryImageURL) this._uploadImage(this.temporaryImageURL);
                        
                        if(!this.fromClub)
                        this.viewCtrl.dismiss({
                            created: true
                        })
                        if(this.fromClub) {

                        this.flightService.applyForClubVerifyDiscountCard(_playerId, _programId, _clubId)
                        .subscribe((data)=>{
                            if(data) {
                                console.log("apply club verify player discount", data);
                                if(this.fromClub) {
                                    this.flightService.approvePlayerDiscountCard(_playerId, _programId, _clubId)
                                    .subscribe((data)=>{
                                        if(data) {
                                            this.viewCtrl.dismiss({
                                                created: true
                                            })
                                        } else {
                                            this.viewCtrl.dismiss({
                                                created: true
                                            })
                                        }
                                    }, (error)=>{
                                        let _error = error.json();
                                        console.log("apply club ", error);
                                        let _msg = 'Error reaching server at the moment. Please try again';
                                        if(_error.errors[0]) _msg = "Error - "+ _error.errors[0]; 
                                        MessageDisplayUtil.showMessageToast(_msg, 
                                        this.platform , this.toastCtl,3000, "bottom"); 
                                        })
                                } else {
                                    this.viewCtrl.dismiss({
                                        created: true
                                    })
                                }
                            } else {
                                
                                this.viewCtrl.dismiss({
                                    created: true
                                })
                            }
                        }, (error)=>{
                            let _error = error.json();
                            console.log("apply club ", error);
                            let _msg = 'Error reaching server at the moment. Please try again';
                            if(_error.errors[0]) _msg = "Error - "+ _error.errors[0]; 
                            MessageDisplayUtil.showMessageToast(_msg, 
                            this.platform , this.toastCtl,3000, "bottom"); 
                            })
                        }
                    }
                }
            }, (error)=>{
                let _error = error.json();
                console.log("add player discount error ", error);
                let _msg;
                if(_error.status === 404) _msg = _error.status + ' - ' + _error.error + ' .' + _error.message;
                else if(_error.errors && _error.errors.length > 0) _msg = _error.errors[0];
                else _msg = 'Error connecting to server. Please try again.'
                MessageDisplayUtil.showErrorToast(_msg, 
                this.platform , this.toastCtl,3000, "bottom");
                return false;
            })
        }

        getDiscountCompanyName() {
            return this.selectedDiscountCompany&&this.selectedDiscountCompany.name?this.selectedDiscountCompany.name:'Select Discount Company (tap here)';
        }

        onSearchDiscountCompany() {
            let modal = this.modalCtrl.create(SearchDiscountCompanyModal, {
                headerTitle: 'Select Discount Company'
            });
            modal.onDidDismiss((data: any)=>{
                if(data && data.selected) {
                    this.selectedDiscountCompany = data.discCompany;
                    this.getDiscountPrograms(this.selectedDiscountCompany);
                    setTimeout(()=>{
                        if(this.discountPrograms && this.discountPrograms.length === 0 || !this.discountPrograms) {
                            MessageDisplayUtil.showMessageToast('There is no program under this company. Please choose different company', 
                            this.platform , this.toastCtl,3000, "bottom");
                        }
                    },500)
                }
            })
            modal.present();
        };

        getDiscountPrograms(discountCompany: DiscountCompany) {
            if(!discountCompany) return false;
            let _companyId = discountCompany.id;
            this.flightService.getDiscountPrograms(_companyId)
            .subscribe((data)=>{
                console.log("discount programs ", data)
                if(data) this.discountPrograms = data;
            })
        }

        onValidFromChange() {
            this.cardValidUntil = moment(this.cardValidFrom).add(1,'months').format("YYYY-MM-DD");
        }

        onPrivilegeApplyClub(pdp: PlayerDiscountProgram) {
            
            this.onClubSelect(pdp);
            if(1) return false;
        
            let prompt = this.alertCtrl.create({
                title: 'Apply Discount Program',
                message: 'This will apply discount program to this club. Do you want to proceed? ',
                // inputs: [{
                //     name: 'title',
                //     placeholder: 'Group Name'
                // }, ],
                buttons: [{
                        text: 'No',
                        handler: data => {
                            prompt.dismiss()
                            return false;
                        }
                    },
                    {
                        text: 'Yes',
                        handler: () => {
                            prompt.dismiss().then(()=>{
                                this.onClubSelect(pdp);
                            })
                            return false;
                        }
                    }
                ]
            });
            prompt.present();
        }
    
        goApplyPrivilegeClub(pdp: PlayerDiscountProgram ,clubId?: number) {
            let _playerId = pdp.player.playerId?pdp.player.playerId:pdp.player.id;
            let _programId = pdp.discountProgram.id;
            let _clubId = clubId;
            this.flightService.applyForClubVerifyDiscountCard(_playerId, _programId, _clubId)
            .subscribe((data)=>{
                console.log("player applinyg for discount card", data);
                if(data) {
                    // this.setOptionType(2);
                }
            }, (error)=>{
                console.log("error apply", error)
                let _error = error.json();
                if(_error && _error.status !== 200) {
                    let _msg = _error.errors[0];
                    if(_error.errorCode.includes('DiscountProgramNotRecognized'))
                            _msg = "There is no valid club discount associated to this card. Please check validity dates.";
                    MessageDisplayUtil.showMessageToast(_msg, 
                    this.platform, this.toastCtl, 3000, "bottom");
                    return false;
                }
            }, () =>{
                this.getListApplications();
            })
        }


        onClubSelect(pdp: PlayerDiscountProgram) {
            let club = this.modalCtrl.create(ProgramClubListPage, {
                // RecentClubListPage
                //analysisType: "analysis",
                // courseInfo: this.courseInfo,
                openedModal: true,
                multiSelect: true,
                programId: this.playerDiscountProgram.discountProgram.id,
                // courseType: this.courseType,
                // clubInfo: this.clubInfo

            });
            
            club.onDidDismiss((data: any) => {
                console.log("club select - ", data)
                let _clubs:Array<ClubData>;
                if (data && data.confirm) {
                    if(data.multiClub && data.multiClub.length > 0)
                    _clubs = data.multiClub;
                    _clubs.forEach((c: ClubData, idx: number)=>{
                        this.goApplyPrivilegeClub(pdp,c.id)
                        // if(idx+1 === _clubs.length)
                        //     this.getListApplications();
                    });
                    // this.clubInfo = data.clubInfo;
                    // this.courseInfo = createCourseInfo();
                }
                // this.clubName = this.clubInfo.clubName;
                // console.log("Type club", this.courseType)
                // console.log("club infO?", this.clubInfo)
            });

            // if (this.courseType == 'course') {
            //     club.onDidDismiss((data: any) => {
            //         if (!data) {
            //             return false;
            //         }
            //         if (data.apply) {
            //             this.courseInfo = data.courseInfo;
            //             this.clubInfo = data.clubInfo;
            //             console.log("Type course:clubinfo", data.clubInfo)
            //             // this.clubName = clubName;
            //             // this.clubName = clubInfo.clubName;
            //             _courseId = this.courseInfo.courseId;
            //             _courseName = this.courseInfo.courseName;
            //         }

            //     });

            // } else if (this.courseType == 'club') {
            //     club.onDidDismiss((data: any) => {
            //         if (data.clubInfo) {
            //             this.clubInfo = data.clubInfo;
            //             this.courseInfo = createCourseInfo();
            //         }
            //         // this.clubName = this.clubInfo.clubName;
            //         console.log("Type club", this.courseType)
            //         console.log("club infO?", this.clubInfo)
            //     });

            // }
            club.present();
        }

        getListApplications() {
            this.pendingPDP = [];
            let _playerId = this.player.playerId?this.player.playerId:this.player.id;
            let _clubId;
            let _program = this.playerDiscountProgram.discountProgram;
            this.flightService.getListAllCardApplyForPlayer(_playerId,_program.id)
                                .subscribe((data)=>{
                                    let _pdp: Array<DiscountPlayerClub>;
                                    if(data) _pdp = data.json();
                                    console.log("get list applications : ", _pdp)
                                    this.pendingPDP = _pdp;
                                    
                                    this.pendingPDP.forEach((pdp: DiscountPlayerClub)=>{
                                        let club = pdp.club;
                                        JsonService.deriveFulImageURL(club,'clubImage');
                                        JsonService.deriveFulImageURL(club,'clubThumbnail');
                                        JsonService.deriveFulImageURL(club,'clubLogo');
                                    })
                                    // if(_pdp && _pdp.length > 0)
                                    // _pdp.filter((p: DiscountPlayerClub)=>{
                                    //     if(p.club.id === _clubId && !p.verified){
                                    //         // _pendingDiscountCards.push(p.playerDiscountProgram)
                                    //         this.pendingPDP.push(p.playerDiscountProgram);
                                    //     }
                                    // })
                                })
        }
        getClubImage(club: ClubData) {
            let _imageUrl;
            if(club.clubThumbnail) _imageUrl = club.clubThumbnail;
            else if(club.clubImage) _imageUrl = club.clubImage;
            else if(club.clubLogo) _imageUrl = club.clubLogo;
            else _imageUrl = '';
           return _imageUrl; 
        }
        onUploadCardClick(pdp: PlayerDiscountProgram) {
            let _buttons = [];
            _buttons.push({
                text: 'Select Photo',
                // role: 'destructive', // will always sort to be on the bottom
                icon: !this.platform.is('ios') ? 'close' : null,
                handler: () => {
                  this.onUploadCardDocument()
                }
              });
              _buttons.push({
                text: 'Take Photo',
                // role: 'destructive', // will always sort to be on the bottom
                icon: !this.platform.is('ios') ? 'close' : null,
                handler: () => {
                  this.onTakePhotoPlayerCard()
                }
              });
    
              let actionSheet = this.actionSheetCtl.create({
                buttons: _buttons
            });
            actionSheet.present();
        }
        onTakePhotoPlayerCard() {
            this.imageService.captureImage(true)
                .subscribe((data: ImageData) => {
                    if(this.mode === 'new') this.temporaryImageURL = data.originalURL;
                    else this._uploadImage(data.originalURL);
                    // this.temporaryImageURL = data.originalURL;
                    console.log("[photo] take photo data : ",data)
                    console.log("[photo] take photo data : ",data.originalURL)
                }, (error) => {
                    console.log("[photo] take photo : ",  error)
                    // alert(JSON.stringify(error));
                });
        }

    //     onAddUploadCard() {
    //         this.imageService.pickImage()
    //             .subscribe((data: ImageData) => {
    //                 // this._uploadImage(data.originalURL);
    //                 this.temporaryImageURL = data.originalURL;
    //                 console.log("[photo] select  photo data : ",data)
    //             }, (error) => {
    //                 console.log("[photo] select photo : ", error)
    //                 //Ignore this error
    //             });
    // }

        onUploadCardDocument() {
                this.imageService.pickImage()
                    .subscribe((data: ImageData) => {
                        if(this.mode === 'new') this.temporaryImageURL = data.originalURL;
                        else this._uploadImage(data.originalURL);
                        // this.temporaryImageURL = data.originalURL;
                        console.log("[photo] select  photo data : ",data)
                        console.log("[photo] select  photo data : ",data.originalURL)
                    }, (error) => {
                        console.log("[photo] select photo : ", error)
                        //Ignore this error
                    });
        }
        _uploadImage(imageURL: string) {
            let _playerDiscountCardId;
            let _contentType;
            if(this.type !== 'playerType') {
                _playerDiscountCardId = this.playerDiscountProgram.id;
            }
                let uploadLoading = this.loadingCtl.create({
                    content: 'Uploading, Please wait...'
                });
                if(this.type === 'playerType') {

                    uploadLoading.present().then(() => {
                        // ContentType.JPEG
                        this.playerHomeActions.addPlayerType(imageURL, ContentType.WILDCARD_IMAGE, this.player.playerId, this.selectedPlayerType.id)
                            .subscribe((data) => {
                                uploadLoading.dismiss().then(() => {
                                    // if(data) this.playerDiscountProgram = data;
                                    if(data) this.temporaryImageURL = imageURL;
                                    // this.cancelEditImage();
                                })
                            }, (error) => {
                                console.log("[photo] uploading image : ", error)
                                uploadLoading.dismiss().then(() => {
                                    // 'Please upload photo not more than 10 MB'
                                    // if(error || error !== null) {
                                        let alert = this.alertCtrl.create({
                                            title  : "Upload Error",
                                            message: 'Please upload photo not more than 10 MB',
                                            buttons: ["Ok"]
                                        });
                                        alert.present();
                                    // }
                                    // else this.cancelEditImage();
                                    
                                })
                            }, ()=>{
                                
                                this.viewCtrl.dismiss({
                                    created: true
                                });
                            })
                    });

                    
                } else {
                    uploadLoading.present().then(() => {
                        this.playerHomeActions.uploadPlayerCardDiscount(imageURL, ContentType.WILDCARD_IMAGE, _playerDiscountCardId)
                            .subscribe((data) => {
                                uploadLoading.dismiss().then(() => {
                                    // if(data) this.playerDiscountProgram = data;
                                    if(data) this.playerDiscountProgram.document = imageURL;
                                    
                                    // this.cancelEditImage();
                                })
                            }, (error) => {
                                console.log("[photo] uploading image : ", error)
                                uploadLoading.dismiss().then(() => {
                                    // 'Please upload photo not more than 10 MB'
                                    // if(error || error !== null) {
                                        let alert = this.alertCtrl.create({
                                            title  : "Upload Error",
                                            message: 'Please upload photo not more than 10 MB',
                                            buttons: ["Ok"]
                                        });
                                        alert.present();
                                    // }
                                    // else this.cancelEditImage();
                                    
                                })
                            })
                    });

                }
        }

        
    isCordova() {
        return this.platform.is('cordova');
    }
    
    onZoomImage(image: string) {
        let imageZoom = this.modalCtrl.create(ImageZoom, {
            image: image
        })

        imageZoom.onDidDismiss((data: any) => {});
        imageZoom.present();
    }

    getAssignablePlayerTypes() {
        this.playerTypes = [];
        this.flightService.assignableBookingPlayerType()
        .subscribe((data: Array<BookingPlayerType>)=>{
            console.log("assignable player types : ", data)
            if(data && data.length > 0) {
                this.playerTypes = data.filter((p)=>{
                    if(p.id === 'LADIES') return false;
                    else if(p.id === 'JUNIOR') return false;
                    else if(p.id === 'SENIOR') return false;
                    else if(p.id === 'MEMBER') return false;
                    else if(p.id === 'TMEMBER') return false;
                    else return true;
                });
            }
            
        })
    }

    onAddPlayerType() {
        if(!this.selectedPlayerType) {
            MessageDisplayUtil.showMessageToast('Please select a Player Type', 
                this.platform, this.toastCtl, 3000, "bottom");
                return false;
        }
        // this.temporaryImageURL = 'temporary_image.png';
        if(!this.temporaryImageURL) {
            MessageDisplayUtil.showMessageToast('Please upload the document', 
                this.platform, this.toastCtl, 3000, "bottom");
                return false;
        }
        if(this.isCordova()) this._uploadImage(this.temporaryImageURL);
        // this.flightService.assignBookingPlayerType(this.player.id, this.selectedPlayerType.id)
        // .subscribe((data)=>{
        //     console.log("assigning booking player type to ", this.player, this.selectedPlayerType, data);
        // })
    }

    onRemoveClubApplication(pdp: DiscountPlayerClub) {
        console.log("[0] removing club application : ", pdp)
        let prompt = this.alertCtrl.create({
            title: 'Remove Club Application',
            message: 'This will remove application from this club. Do you want to proceed? ',
            // inputs: [{
            //     name: 'title',
            //     placeholder: 'Group Name'
            // }, ],
            buttons: [{
                    text: 'No',
                    handler: data => {
                        prompt.dismiss()
                        return false;
                    }
                },
                {
                    text: 'Yes',
                    handler: () => {
                        prompt.dismiss().then(()=>{
                            this.goRemoveClubApplication(pdp);
                        })
                        return false;
                    }
                }
            ]
        });
        prompt.present();
    }

    goRemoveClubApplication(pdp: DiscountPlayerClub) {
        let _clubId = pdp.club.id
        let _playerDiscountId = pdp.playerDiscountProgram.id;
        console.log("[1] removing club application : ", pdp)
        this.flightService.removeCardClubApplication(_clubId, _playerDiscountId)
        .subscribe((data: any)=>{
            console.log("[2] removing club application : ", data)
        }, (error)=>{
            if(error) {
                MessageDisplayUtil.showErrorToast('Something is wrong with the server. Please try again.', 
                this.platform, this.toastCtl, 3000, "bottom");
                return false;
            }
        }, ()=>{
            this.getListApplications();
            MessageDisplayUtil.showErrorToast('Successfully removed club application for this card', 
                this.platform, this.toastCtl, 3000, "bottom");
                return false;
        })
    }

    onUpdateDiscountCard() {
        
        if(!this.cardMembershipNo || (this.cardMembershipNo && this.cardMembershipNo.length === 0)) {
            MessageDisplayUtil.showMessageToast('Please enter membership number', 
            this.platform , this.toastCtl,3000, "bottom");
            return false;
        }
        if(this.cardValidFrom >= this.cardValidUntil) {
            MessageDisplayUtil.showMessageToast('Please enter valid dates', 
            this.platform , this.toastCtl,3000, "bottom");
            return false;
        }
        console.log("fromClub - ", this.fromClub, ' - ', this.clubId);
        console.log("forBooking - ", this.forBooking);
        console.log("player - ", this.player);
        let _playerId = this.player.playerId?this.player.playerId:this.player.id; // | this.player.id;

        let _programId = this.playerDiscountProgram.discountProgram.id;
        let _membershipNo = this.cardMembershipNo;
        let _clubId = this.fromClub?this.clubId:null;
        let _validFrom = moment(this.cardValidFrom).format("YYYY-MM-DD");
        let _validUntil = moment(this.cardValidUntil).format("YYYY-MM-DD");
        let _msg;
        console.log("adding player discount : ", _playerId, _programId, _membershipNo, _validFrom, _validUntil);
        this.flightService.createPlayerDiscountCard(_playerId, _programId, _membershipNo, _validFrom, _validUntil)
        .subscribe((data)=>{
            if(data) {
                console.log("create player discount", data);
                if(data.status === 200) {
                    let _data = data.json();
                    let _existing = false;

                    if(this.data) {
                        this.data.filter((d)=>{
                            if(d.id === _data.id) _existing = true;
                        })
                        let _msg = "Successfully updated discount card";
                        MessageDisplayUtil.showErrorToast(_msg, 
                            this.platform , this.toastCtl,3000, "bottom");
                            // return false;
                    }
                    if(_existing) _msg = 'Successfully updated card #id : '+_data.membershipNumber;
                    else _msg = 'Successfully added new card';
                    MessageDisplayUtil.showMessageToast(_msg, 
                    this.platform , this.toastCtl,3000, "bottom");
                    this.playerDiscountProgram = _data;
                    if(this.isCordova() && this.temporaryImageURL) this._uploadImage(this.temporaryImageURL);
                    
                    if(!this.fromClub)
                    this.viewCtrl.dismiss({
                        created: true
                    })
                    // if(this.fromClub) {

                    // this.flightService.applyForClubVerifyDiscountCard(_playerId, _programId, _clubId)
                    // .subscribe((data)=>{
                    //     if(data) {
                    //         console.log("apply club verify player discount", data);
                    //         if(this.fromClub) {
                    //             this.flightService.approvePlayerDiscountCard(_playerId, _programId, _clubId)
                    //             .subscribe((data)=>{
                    //                 if(data) {
                    //                     this.viewCtrl.dismiss({
                    //                         created: true
                    //                     })
                    //                 } else {
                    //                     this.viewCtrl.dismiss({
                    //                         created: true
                    //                     })
                    //                 }
                    //             }, (error)=>{
                    //                 let _error = error.json();
                    //                 console.log("apply club ", error);
                    //                 let _msg = 'Error reaching server at the moment. Please try again';
                    //                 if(_error.errors[0]) _msg = "Error - "+ _error.errors[0]; 
                    //                 MessageDisplayUtil.showMessageToast(_msg, 
                    //                 this.platform , this.toastCtl,3000, "bottom"); 
                    //                 })
                    //         } else {
                    //             this.viewCtrl.dismiss({
                    //                 created: true
                    //             })
                    //         }
                    //     } else {
                            
                    //         this.viewCtrl.dismiss({
                    //             created: true
                    //         })
                    //     }
                    // }, (error)=>{
                    //     let _error = error.json();
                    //     console.log("apply club ", error);
                    //     let _msg = 'Error reaching server at the moment. Please try again';
                    //     if(_error.errors[0]) _msg = "Error - "+ _error.errors[0]; 
                    //     MessageDisplayUtil.showMessageToast(_msg, 
                    //     this.platform , this.toastCtl,3000, "bottom"); 
                    //     })
                    // }
                }
            }
        }, (error)=>{
            let _error = error.json();
            console.log("add player discount error ", error);
            let _msg;
            if(_error.status === 404) _msg = _error.status + ' - ' + _error.error + ' .' + _error.message;
            else if(_error.errors && _error.errors.length > 0) _msg = _error.errors[0];
            else _msg = 'Error connecting to server. Please try again.'
            MessageDisplayUtil.showErrorToast(_msg, 
            this.platform , this.toastCtl,3000, "bottom");
            return false;
        })
    }

    checkCardApproved() {
        let _approved;
        _approved = this.pendingPDP;
        // _approved = this.pendingPDP.filter((pdp)=>{
        //     return pdp.approved || pdp.verified
        // })

        return _approved && _approved.length > 0
    }
}
