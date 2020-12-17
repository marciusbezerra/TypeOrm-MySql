import "reflect-metadata";
import { Album } from './entity/Album';
import { Photo } from './entity/Photo';
import * as express from "express";
import { Request, Response } from "express";
import { createConnection } from "typeorm";

createConnection().then(connection => {

    const photoRepository = connection.getRepository(Photo);
    const albumRepository = connection.getRepository(Album);


    // create and setup express app
    const app = express();
    app.use(express.json());

    // register routes

    app.get("/api/", async function (req: Request, res: Response) {
        res.json({
            status: 'Working!'
        });
    });

    app.get("/api/albuns", async function (req: Request, res: Response) {
        const album = await (await albumRepository.find({ relations: ['photos'] }));
        res.json(album);
    });

    app.get("/api/albuns/:id", async function (req: Request, res: Response) {
        const albums = await albumRepository.findOne(req.params.id);
        res.json(albums);
    });

    app.post("/api/albuns", async function (req: Request, res: Response) {
        const album = await albumRepository.create(req.body);
        const results = await albumRepository.save(album);
        return res.send(results);
    });

    app.get("/api/photos", async function (req: Request, res: Response) {
        const photo = await photoRepository.find();
        res.json(photo);
    });

    app.get("/api/photos/:id", async function (req: Request, res: Response) {
        const photos = await photoRepository.findOne(req.params.id);
        res.json(photos);
    });

    app.post("/api/photos", async function (req: Request, res: Response) {
        const photo = await photoRepository.create(req.body);
        const results = await photoRepository.save(photo);
        return res.send(results);
    });

    app.put("/api/photos/:id", async function (req: Request, res: Response) {
        const photo = await photoRepository.findOne(req.params.id);
        photoRepository.merge(photo, req.body);
        const results = await photoRepository.save(photo);
        return res.send(results);
    });

    const port = process.env.PORT || 3000;

    // start express server
    app.listen(port, () => console.log(`listening in port ${port}...`));

});