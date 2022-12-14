import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../confirm-dialog/confirm-dialog.component';
import { Artwork } from '../models/artwork';
import { ArtworkApproval } from '../models/artwork-approval';
import { ArtworkAsset } from '../models/artworkAsset';
import { Exhibit } from '../models/exhibit';
import { User } from '../models/user';
import { ArtworkApprovalService } from '../services/artwork-approval.service';
import { ArtworkService } from '../services/artwork.service';
import { AssetService } from '../services/asset.service';
import { AuthenticationService } from '../services/authentication.service';
import { ExhibitService } from '../services/exhibit.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-art-add',
  templateUrl: './art-add.component.html',
  styleUrls: ['./art-add.component.scss']
})
export class ArtAddComponent implements OnInit {

  title = '';
  exhibits?: Exhibit[];
  artForm!: FormGroup;
  artwork: Artwork = new Artwork();

  imageUrl: string = '';
  audioUrl: string = '';
  autoPlayAudio: boolean = true;
  onlyInHeadphone: boolean = false;
  description = '';

  audioAsset?: ArtworkAsset;
  imageAsset?: ArtworkAsset;

  uploadImage: boolean = false;
  uploadAudio: boolean = false;

  longDescription: string = '';
  user?: User;

  approvalObject?: ArtworkApproval = new ArtworkApproval();
  approvalComment: string = '';

  isApprovalWindow: boolean = false;


  constructor(private authService: AuthenticationService,
    private artworkService: ArtworkService,
    private exhibitService: ExhibitService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private assetService: AssetService,
    public dialog: MatDialog,
    private artworkApprovalService: ArtworkApprovalService,
    private notificationService: NotificationService

  ) { }

  ngOnInit(): void {


    this.authService.userSubject.subscribe((data) => {
      this.user = data;
    });

    this.exhibitService.getAll().subscribe((data: any) => {
      this.exhibits = data as Exhibit[];
    });

    this.artForm = this.fb.group({
      ExhibitId: [1, [Validators.required]],
      title: ['', [Validators.required, Validators.maxLength(30)]],
      description: [''],
      moreInfo: [''],
      longDescription: [''],
      approved: [true]

    });

    this.route.params.subscribe(params => {
      const id = params['id'];

      if (id && id > 0) {
        this.title = "Edit Art";
        this.loadArtwork(id);
      }
      else {
        this.artwork.id = 0;
        this.title = "Create Art"
      }

    });

    if (this.router.url.indexOf('/approvals/') > -1) {
      this.isApprovalWindow = true;
      this.title = 'Approval'
    }




  }

  loadArtwork(id: number) {
    this.artworkService.get(id).subscribe(data => {
      this.artwork = data;
      console.log(data);
      console.log(this.artwork);

      if (this.artwork.ArtworkAssets && this.artwork.ArtworkAssets.length > 0) {

        this.imageAsset = this.artwork.ArtworkAssets?.filter(c => c.assetType == 0).shift();
        this.audioAsset = this.artwork.ArtworkAssets?.filter(c => c.assetType == 1).shift();

      } else {
        const imageAsset = {
          id: 0,
          ArtworkId: 0,
          visible: true,
          approved: true,
          assetType: 0,
          address: this.imageUrl,
          title: 'asset',
          description: 'description'
        };

        const audioAsset = {
          ...imageAsset,
          autoPlay: this.autoPlayAudio,
          onlyInHeadphone: this.onlyInHeadphone
        };
        this.imageAsset = imageAsset;
        this.audioAsset = audioAsset;
        this.audioAsset.assetType = 1;
      }
      // this.artForm.controls['description'].patchValue(this.artwork.description);
      this.imageUrl = this.imageAsset?.address || '';
      this.audioUrl = this.audioAsset?.address || '';
      this.autoPlayAudio = this.audioAsset?.autoPlay == undefined ? false : this.audioAsset?.autoPlay;
      this.onlyInHeadphone = this.audioAsset?.onlyInHeadphone == undefined ? false : this.audioAsset?.onlyInHeadphone;




      // TextArea to formcontrol binding didn't work
      this.longDescription = this.artwork.longDescription || '';

      this.artForm.patchValue({
        title: this.artwork.title,
        description: this.artwork.description,
        moreInfo: this.artwork.moreInfo,
        ExhibitId: this.artwork.ExhibitId,
        longDescription: this.artwork.longDescription
      });

      this.artworkApprovalService.getByArtworkId(this.artwork.id).subscribe(data => {
        console.log('Got approval object:');
        console.log(data);
        this.approvalObject = data;
        this.approvalComment = this.approvalObject?.comment || '';
      })

    });
  }

  submitForm() {
    if (this.artwork.id > 0) {
      console.log('Editing art');
      this.editArt();
    } else {
      console.log('Creating art');
      this.createArt();
    }
  }

  editArt() {
    this.artForm.patchValue({
      longDescription: this.longDescription
    });

    const artValue = this.artForm.value;
    artValue.id = this.artwork.id;


    this.artworkService.edit(artValue, this.artwork.id).subscribe(data => {
      console.log('Edited artwork');

      this.audioAsset!.address = this.audioUrl;
      this.imageAsset!.address = this.imageUrl;
      this.audioAsset!.autoPlay = this.autoPlayAudio;
      this.audioAsset!.onlyInHeadphone = this.onlyInHeadphone;

      if (this.audioAsset?.id == 0) {
        this.audioAsset.ArtworkId = this.artwork.id;
        this.assetService.create(this.audioAsset).subscribe(data => {
          console.log('Created audio');
        });
      } else {

        this.assetService.edit(this.audioAsset, this.audioAsset!.id).subscribe(data => {
          console.log('Edited audio');
        });
      }


      if (this.imageAsset?.id == 0) {
        this.imageAsset.ArtworkId = this.artwork.id;
        this.assetService.create(this.imageAsset).subscribe(data => {
          console.log('Created Image');
        });
      }
      else {

        this.assetService.edit(this.imageAsset, this.imageAsset!.id).subscribe(data => {
          console.log('Edited image');
        });
      }


      const message = `The record was successfully edited.`;
      const dialogData = new ConfirmDialogModel("Success", message, true);
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        maxWidth: "400px",
        data: dialogData
      });

      this.router.navigate(['arts']);


    });

  }

  createArt() {
    console.log('Submitted');
    console.log(this.artForm.value);

    this.artForm.patchValue({
      longDescription: this.longDescription
    });


    const imageAsset = {
      ArtworkId: 0,
      visible: true,
      approved: true,
      assetType: 0,
      address: this.imageUrl,
      title: 'asset',
      description: 'description'
    };

    const audioAsset = {
      ...imageAsset,
      autoPlay: this.autoPlayAudio,
      onlyInHeadphone: this.onlyInHeadphone
    };

    audioAsset.assetType = 1;
    audioAsset.address = this.audioUrl;
    audioAsset.title = "Audio"

    if (this.artwork.id == 0) {

      this.artworkService.create(this.artForm.value).subscribe((data) => {

        console.log(data);
        this.artwork.id = data.id;
        imageAsset.ArtworkId = data.id;
        audioAsset.ArtworkId = data.id;
        this.assetService.create(imageAsset).subscribe((data) => {
          console.log('Added Image');
          this.assetService.create(audioAsset).subscribe((data) => {
            console.log('Added Audio');

            const message = `New record was successfully added.`;
            const dialogData = new ConfirmDialogModel("success", message, true);
            const dialogRef = this.dialog.open(ConfirmDialogComponent, {
              maxWidth: "400px",
              data: dialogData,
            });

            this.router.navigate(['arts']);
          });
        });
      });

    }
  }

  cancel() {
    this.router.navigate(['arts']);
  }

  updateImageUrl(fullPath: string) {
    this.imageUrl = fullPath;
  }

  updateAudioUrl(fullPath: string) {
    this.audioUrl = fullPath;
  }

  approvalRequest() {

    this.artworkApprovalService.requestApproval(this.artwork.id).subscribe(data => {
      console.log(data);
      this.loadArtwork(this.artwork.id);
      this.notificationService.alert('Approval Request sent');
    });

    // this.notificationService.confirmation('Are you sure to send this for approval?', () => {
    //   this.artworkApprovalService.requestApproval(this.artwork.id).subscribe(data => {
    //     console.log(data);
    //   });
    //   this.notificationService.alert('Request sent', 'Request sent');
    // });

  }


  acceptApproval(reject: boolean) {
    if (!this.approvalObject) {
      console.log('No request to approve');
      return;
    }
    this.artworkApprovalService.approveReject(this.approvalObject?.id, reject, this.approvalComment).subscribe(data => {
      console.log(data);
      this.loadArtwork(this.artwork.id);
      this.notificationService.success('Approval complete');
    });
  }
}
