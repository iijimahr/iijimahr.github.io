#!/usr/bin/env python
# Copyright 2020 H. Iijima
import pickle
import os.path
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request

# If modifying these scopes, delete the file token.pickle.
SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']

# Information of spreadsheet
SPREADSHEET_ID = '1TmjoGXpc9vfyeUzti-uniKjajtbitTKwsJ0SAWWDTAA'
PRESENTTIONS_RANGE_NAME = 'Presentations!A1:M'

def main():
    """
    Generate pickle files from Google spreadsheet
    """

    # Get authorization of API access
    creds = None
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)

    # Call the Sheets API
    service = build('sheets', 'v4', credentials=creds)
    sheet = service.spreadsheets()
    result = sheet.values().get(
        spreadsheetId=SPREADSHEET_ID,
        range=PRESENTTIONS_RANGE_NAME).execute()
    values = result.get('values', [])

    if not values:
        print('No data found.')
    else:
        with open('presentations.pickle', 'wb') as sheet:
            pickle.dump(values, sheet)

if __name__ == '__main__':
    main()
    import pickle
    with open('presentations.pickle', 'rb') as sheet:
        values = pickle.load(sheet)
        header = values[0]
        data = values[1:]
        print('%s, %s, %s, %s:'%
              (header[0], header[1], header[7], header[8]))
        for row in data:
            if (row[6] == 'en' and row[5] == 'invited'):
                print('%s, %s, %s, %s' % (row[0], row[1], row[7], row[8]))
        # for row in data:
        #     if (row[6] == 'en' and row[5] != 'invited'):
        #         print('%s, %s, %s, %s' % (row[0], row[1], row[7], row[8]))
        for row in data:
            if (row[6] == 'jp' and row[5] == 'invited'):
                print('%s, %s, %s, %s' % (row[0], row[1], row[7], row[8]))
        # for row in data:
        #     if (row[6] == 'jp' and row[5] != 'invited'):
        #         print('%s, %s, %s, %s' % (row[0], row[1], row[7], row[8]))
