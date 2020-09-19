import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './ReadSpListItemsWebPart.module.scss';
import * as strings from 'ReadSpListItemsWebPartStrings';



import {

  SPHttpClient,

  SPHttpClientResponse   

} from '@microsoft/sp-http';

import {

  Environment,

  EnvironmentType

} from '@microsoft/sp-core-library';





export interface IReadSpListItemsWebPartProps {
  description: string;
}





export interface ISPLists 

{

  value: ISPList[];

}

export interface ISPList 

{

  Title: string;

  FirstName :string;

  Description :string;

  OverTime :number;

  CreatedBy :string;

  CreatedDate :Date;



}








export default class ReadSpListItemsWebPart extends BaseClientSideWebPart<IReadSpListItemsWebPartProps> {






  private _getListData(): Promise<ISPLists>

   {

    return this.context.spHttpClient.get(this.context.pageContext.web.absoluteUrl + "/_api/web/lists/GetByTitle('Employees')/Items",SPHttpClient.configurations.v1)

        .then((response: SPHttpClientResponse) => 

        {

        return response.json();

        });

    }

    private _renderListAsync(): void

    {

   

     if (Environment.type == EnvironmentType.SharePoint || 

              Environment.type == EnvironmentType.ClassicSharePoint) {

      this._getListData()

        .then((response) => {

          this._renderList(response.value);

        });

 }

  }

  private _renderList(items: ISPList[]): void 

   {

    let html: string = '<table border=1 width=100% style="border-collapse: collapse;">';

    html += '<th>Title</th> <th>FirstName</th> <th>CreatedBy</th> <th>OverTime</th> <th>Description</th> <th>CreatedDate</th>';

    items.forEach((item: ISPList) => {

      html += `

      <tr>            

          <td>${item.Title}</td>

          <td>${item.CreatedBy}</td>

          <td>${item.FirstName}</td>

          <td>${item.OverTime}</td>

          <td>${item.Description}</td>

          <td>${item.CreatedDate}</td>

          

          </tr>

          `;

    });

    html += '</table>';

  

    const listContainer: Element = this.domElement.querySelector('#spListContainer');

    listContainer.innerHTML = html;

  }










  
  public render(): void {
    this.domElement.innerHTML = `

      <div class="${ styles.readSpListItems }">

        <div class="${ styles.container }">

          <div class="ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${ styles.row }">

          <div class="ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1">

          <span class="ms-font-xl ms-fontColor-white">Welcome to SharePoint Employees List</span>

          <p class="ms-font-l ms-fontColor-white">Loading from ${this.context.pageContext.web.title}</p>

          <p class="ms-font-l ms-fontColor-white">Employees</p>

        </div>

      </div> 

          <div class="ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}">

          <div>List Items</div>

          <br>

           <div id="spListContainer" />

        </div>

      </div>`;

      this._renderListAsync();

  }










  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
