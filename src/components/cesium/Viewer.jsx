import '@shoelace-style/shoelace/dist/themes/light.css'
import { LayersUtils }                                   from '@Utils/cesium/LayersUtils'
import { SceneUtils }                                    from '@Utils/cesium/SceneUtils'
import * as Cesium                                       from 'cesium'
import { ImageryLayerCollection, WebMercatorProjection } from 'cesium'

export function Viewer() {

    const coordinates = {
        position: {
            longitude: __.ui.sceneManager.is2D
                       ? lgs.settings.getStarter.longitude         // Camera target
                       : lgs.settings.getStarter.camera.longitude, // Camera position
            latitude:  __.ui.sceneManager.is2D                    // Camera target
                       ? lgs.settings.getStarter.latitude          // Camera position
                       : lgs.settings.getStarter.camera.latitude,
            height:    lgs.settings.getStarter.camera.height,
            heading:   lgs.settings.getStarter.camera.heading,
            pitch:     lgs.settings.getStarter.camera.pitch,
            roll:      lgs.settings.getStarter.camera.roll,
        },
    }

    const startCameraPoint = () => {

        return Cesium.Cartesian3.fromDegrees(
            coordinates.position.longitude,
            coordinates.position.latitude,
            coordinates.position.height,
        )
    }

    const cameraOrientation = () => {
        return {
            heading: Cesium.Math.toRadians(coordinates.position.heading),
            pitch:   Cesium.Math.toRadians(coordinates.position.pitch),
            roll:    Cesium.Math.toRadians(coordinates.position.roll),
        }
    }

    const cameraStore = lgs.mainProxy.components.camera

    const rotateCamera = async () => {
        if (lgs.settings.getStarter.camera.canRotate && lgs.journeys.size === 0) {
            await __.ui.cameraManager.runOrbital({})
        }
    }

    const raiseCameraUpdateEvent = async () => {
        await __.ui.cameraManager.raiseUpdateEvent({})
    }
    // If initialisation phase was OK, we have somme additional tasks to do.

    // Initialize the Cesium Viewer only once
    if (!lgs.viewer) {
        lgs.viewer = new Cesium.Viewer('cesium-viewer', {
            homeButton:           false,
            timeline:             false,
            animation:            false,
            navigationHelpButton: false,
            fullscreenButton:     false,
            geocoder:             false,
            infoBox:              false,
            sceneModePicker:      false,
            showRenderLoopErrors: false,
            mapProjection:        new WebMercatorProjection(), // TODO is it a problem in 3D ?
            // Avoid consuming Cesium Ion Sessions
            // DO NOT CHANGE the 2 following lines
            imageryProvider: false,
            baseLayerPicker: false,
        })
    }
    // Change scene mode
    lgs.viewer.scene.sceneMode = SceneUtils.modeFromLGSToGIS(lgs.settings.scene.mode)

    // Add some globe parameters
    lgs.scene.globe.enableLighting = false
    lgs.scene.globe.depthTestAgainstTerrain = true

    //Layers
    const layerCollection = new ImageryLayerCollection()
    layerCollection.layerAdded = LayersUtils.layerOrder

    // Manage Camera
    lgs.camera.changed.addEventListener(raiseCameraUpdateEvent)
    lgs.camera.flyTo({
                         orientation:   cameraOrientation(),
                         duration:      lgs.settings.camera.flyingTime,
                         destination:   startCameraPoint(),
                         maximumHeight: lgs.settings.camera.maximumHeight,
                         complete:      rotateCamera,
                         convert:       false,
                     })


    return (<></>)
}

