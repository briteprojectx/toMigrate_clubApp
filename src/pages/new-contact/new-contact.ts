import {
    AlertController,
    Events,
    LoadingController,
    NavController,
    NavParams,
    Platform,
    ToastController,
    ViewController
} from 'ionic-angular';
import {Contact, ContactField, Contacts, IContactField} from '@ionic-native/contacts';
import {isPresent} from 'ionic-angular/util/util';
import {Component, Renderer} from '@angular/core';
import {adjustViewZIndex} from '../../globals';
import {MessageDisplayUtil} from '../../message-display-utils';
import {PlayerInfo} from './../../data/player-data';
import {Country} from './../../data/country-location';
import {PlayerService} from '../../providers/player-service/player-service';
@Component({
    templateUrl: 'new-contact.html'
})
export class NewContactPage
{
    public firstName: string;
    public lastName: string;
    public email: string;
    public phone: string;
    public handicap: number;
    public gender: string     = "M";
    public teeOffFrom: string = "Black";
    public creating: boolean  = false;
    public openedAsDialog: boolean;
    public phoneLength: number;
    public countryList: Array<Country>;
    public countryId: string = "MYS";
    public nationalityList: Array<Country>;
    public nationalityId: string = "MYS";
    public openedModal: boolean;

    constructor(private navParams: NavParams,
        private contacts: Contacts,
        private platform: Platform,
        private viewCtl: ViewController,
        private nav: NavController,
        private renderer: Renderer,
        private alertCtl: AlertController,
        private loadCtl: LoadingController,
        private toastCtl: ToastController,
        private events: Events,
        private playerService: PlayerService) {
        this.openedAsDialog = navParams.get("openedAsDialog");
        this.openedModal = navParams.get("openedModal");
    }

    ionViewDidEnter() {
        if (!this.openedAsDialog) {
            adjustViewZIndex(this.nav, this.renderer);
        }
        this.getCountry();
    }

    createContact() {
        //Validate the entries

        console.log(this.phoneLength);
        if (!isPresent(this.firstName) || !isPresent(this.email) || !isPresent(this.lastName) || this.firstName == '' || this.lastName == '') {
            let msg = "Please enter all mandatory fields!";
            MessageDisplayUtil.displayErrorAlert(this.alertCtl, "New Contact",
                msg, "OK");
            return;
        }
        let busy = this.loadCtl.create({
            content: "Creating contact..."
        });
        busy.present().then(() => {
            this.creating = true;
            this.playerService.addContact(this.firstName, this.lastName,
                this.gender, this.email, this.phone, this.handicap, this.teeOffFrom, this.countryId, this.nationalityId)
                .subscribe((player: PlayerInfo) => {
                    //Player registered successfully. Go back to where came from
                    busy.dismiss().then(() => {
                        if (this.openedAsDialog)
                            this.viewCtl.dismiss(player);
                        else {
                            this.events.publish("FriendListUpdate");
                            this.nav.pop();
                        }
                    });

                }, (error) => {
                    busy.dismiss().then(() => {
                        console.log("creating contact error : ", error)
                        let _error = error.json();
                        this.creating = false;
                        // let msg       = MessageDisplayUtil.getErrorMessage(error, "Error creating contact");
                        let msg       = MessageDisplayUtil.getErrorMessage(error, _error.errorMessage);
                        MessageDisplayUtil.showErrorToast(msg, this.platform, this.toastCtl, 5000, "bottom");
                    });

                }, () => {
                    this.creating = false;
                });
        });

    }

    pickAContact() {
        this.contacts.pickContact()
                .then((contact: Contact) => {
                    this.firstName = contact.name.givenName;
                    this.lastName  = contact.name.familyName;
                    if (contact.emails && contact.emails.length) {
                        //Find whether preferred is set
                        let emails: Array<IContactField> =
                                contact.emails.filter((f: ContactField) => {
                                    return f.pref;
                                });
                        if (emails && emails.length) this.email = emails[0].value;
                        else this.email = contact.emails[0].value;
                    }
                    else this.email = "";
                    //Pick the phone number
                    if (contact.phoneNumbers && contact.phoneNumbers.length) {
                        this.phone = this.pickPhoneNumber(contact.phoneNumbers);
                    }
                    else this.phone = "";
                    // alert(JSON.stringify(contact.phoneNumbers));
                }, (error) => {
                    alert(JSON.stringify(error));
                });
    }

    private pickPhoneNumber(phoneNumbers: Array<IContactField>): string {
        let mobileNumbers: Array<IContactField>
                = phoneNumbers.filter((ph: ContactField) => {
            return "mobile" === ph.type.toLowerCase();
        });
        if (mobileNumbers && mobileNumbers.length === 1)
            return mobileNumbers[0].value;
        else if (mobileNumbers && mobileNumbers.length > 1) {
            let preferred = mobileNumbers.filter(m => {
                return m.pref;
            });
            if (preferred && preferred.length)
                return preferred[0].value;
            else return mobileNumbers[0].value;
        }
        else {
            //mobile numbers not found. Find other numbers
            let preferred = phoneNumbers.filter(p => {
                return p.pref
            });
            if (preferred && preferred.length)
                return preferred[0].value;
            else
                return phoneNumbers[0].value;
        }
    }

    close() {
        if (this.openedAsDialog || this.openedModal) this.viewCtl.dismiss();
    }

    getCountry() {
        this.playerService.getCountryList()
                .subscribe((data: Array<Country>) => {
                            // console.log("Country Sign Up : ",data)
                            this.countryList = data;
                            this.nationalityList = data;
                            // console.log("Country List Sign Up : ", this.countryList)
        });
    }
}
