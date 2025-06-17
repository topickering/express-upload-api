import request from "supertest";
import app from '../app.js';
import {describe, it, expect, beforeAll, afterAll} from 'vitest';
import fs from 'fs'
import path from 'path'

let testApp;

function waitOneSecond() {
    return new Promise(resolve => setTimeout(resolve, 1000));
}

function deleteTestFiles() {
    const uploadsDir = path.join(__dirname, '.', 'uploads')
        fs.readdir(uploadsDir, (e, files) => {
            files.forEach((file) => {
                if (file != '.gitignore') {
                    const file_path = path.join (uploadsDir, file) 
                    fs.unlink(file_path, () => {})
                }
            })
        })
}

describe('uploadRoutes', () => {

    beforeAll(() => {
        testApp = request(app);
    })

    afterAll(() => {
        deleteTestFiles();
    })

    describe('POST /upload', () => {
        it('responds with a 400 if no file attached', async () => {
            const response = await testApp
                .post('/upload')
                .set('Accept', 'application/json')
            expect(response.status).toEqual(400)
            expect(response.text).toEqual('No file uploaded')
        })

        it('responds with a 200 and json', async () => {
            const response = await testApp
                .post('/upload')
                .set('Accept', 'application/json')
                .attach('file', '../resources/smallTestData.csv')

            expect(response.status).toEqual(200);
            expect(response.body).toEqual(expect.objectContaining({ 
                uploadId: expect.any(String),
                message: 'File uploaded successfully. Processing started.'
            }))
        })
    })

    describe('get /upload/_id', () => {

        it('responds with a 200', async () => {
            const response = await testApp
                .post('/upload')
                .set('Accept', 'application/json')
                .attach('file', '../resources/smallTestData.csv')
                .then(async function (res) {
                    const { uploadId } = res.body;
                    await waitOneSecond();
                    return testApp
                    .get(`/upload/${uploadId}`)
                    .set('Accept', 'application/json')
                })

            expect(response.status).toEqual(200);
            expect(response.body).toEqual(expect.objectContaining({ 
                totalRecords: 1,
                processedRecords: 1,
                failedRecords: 0,
                details: []
            }))
        })
    })

    describe('get /status/_id', () => {

        it('responds with a 200', async () => {
            const response = await testApp
                .post('/upload')
                .set('Accept', 'application/json')
                .attach('file', '../resources/smallTestData.csv')
                .then(async function (res) {
                    const { uploadId } = res.body;
                    await waitOneSecond();
                    return testApp
                    .get(`/status/${uploadId}`)
                    .set('Accept', 'application/json')
                })

            expect(response.status).toEqual(200);
            expect(response.body).toEqual(expect.objectContaining({ 
                uploadId: expect.any(String),
                progress: expect.any(String)
            }))
        })
    })
})