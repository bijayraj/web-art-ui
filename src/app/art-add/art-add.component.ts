import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Artwork } from '../models/artwork';
import { Exhibit } from '../models/exhibit';
import { ArtworkService } from '../services/artwork.service';
import { AuthenticationService } from '../services/authentication.service';
import { ExhibitService } from '../services/exhibit.service';

@Component({
  selector: 'app-art-add',
  templateUrl: './art-add.component.html',
  styleUrls: ['./art-add.component.scss']
})
export class ArtAddComponent implements OnInit {
  exhibits?: Exhibit[];
  artForm!:FormGroup;
  artwork:Artwork = new Artwork();

  imageUrl:string = '';
  audioUrl:string = '';
  description = '';

  constructor(private authService: AuthenticationService, 
   private artworkService: ArtworkService, 
    private exhibitService: ExhibitService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute

    ) { }

  ngOnInit(): void {
    this.exhibitService.getAll().subscribe((data:any)=>{
      this.exhibits = data as Exhibit[];
    });

    this.artForm = this.fb.group({
      ExhibitId: [1, [Validators.required]],
      title: ['', [Validators.required, Validators.maxLength(30)]],
      description:[''],
      moreInfo: ['']
    });

    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id && id>0){
        this.artworkService.get(id).subscribe(data => {
          this.artwork = data;
          console.log(data);
          console.log(this.artwork);

          this.artForm.patchValue({
            title: this.artwork.title,
            description: this.artwork.description,
            moreInfo: this.artwork.moreInfo,
            ExhibitId: this.artwork.ExhibitId
          });

          // this.artForm.controls['description'].patchValue(this.artwork.description);

          const audios = data.ArtworkAssets.filter((dt:any) => dt.assetType==1)
          const images = data.ArtworkAssets.filter((dt:any) => dt.assetType==0)
          this.imageUrl = images[0].address;
          this.audioUrl = audios[0].address;
  
        });
      }
      
    });
  }
  

  createArt(){
    console.log('Submitted')
   console.log(this.artForm.value)
  }
}
