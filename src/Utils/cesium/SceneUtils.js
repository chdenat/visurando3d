import { SCENE_MODE_2D, SCENE_MODE_3D, SCENE_MODE_COLUMBUS } from '@Core/constants'
import { Cartesian3, EasingFunction, Matrix4, SceneMode }    from 'cesium'

export class SceneUtils {

    /**
     * Do Morphing and trigger event if there is a callback
     *
     * @param sceneMode {integer} SCENE_MODE_2D.value or SCENE_MODE_3D.value
     * @param callback
     */


    static morph = async (sceneMode, callback = null) => {
        // Trigger morphComplete only once,
        let remove = null
        const useCallback = async (event, currentSceneMode) => {
            // We launch callback function only once then we remove the listener
            if (callback) {
                await callback({current: currentSceneMode, new: sceneMode})
                if (remove) {
                    remove()
                }
                if (sceneMode === SCENE_MODE_2D.value) {

                    __.ui.cameraManager.position.longitude = __.ui.cameraManager.target.longitude
                    __.ui.cameraManager.position.latitude = __.ui.cameraManager.target.latitude

                    lgs.camera.flyTo({
                                         destination:    Cartesian3.fromDegrees(
                                             __.ui.cameraManager.position.longitude,
                                             __.ui.cameraManager.position.latitude,
                                             __.ui.cameraManager.position.height,
                                         ),
                                         maximumHeight:  10000,
                                         duration:       0, // always.
                                         convert:        true,
                                         endTransform:   Matrix4.IDENTITY,
                                         easingFunction: EasingFunction.LINEAR_NONE,
                                     })
                }

            }
        }
        if (typeof callback === 'function' && !SceneUtils.morphCompeteEvent) {
            remove = lgs.scene.morphComplete.addEventListener(useCallback)
        }

        switch (sceneMode) {
            case SCENE_MODE_2D.value:
                await lgs.scene.morphTo2D(lgs.settings.scene.morphDelay)
                break

            case SCENE_MODE_COLUMBUS.value:
                await lgs.scene.morphToColumbusView(lgs.settings.scene.morphDelay)
                break

            case SCENE_MODE_3D.value:
                await lgs.scene.morphTo3D(lgs.settings.scene.morphDelay)
                break
        }
    }

    /**
     * Return LGS scene mode from Cesium scene
     *
     * @return {{icon: IconDefinition, label: string, title: string, value: number}|{icon: IconDefinition, label:
     *     string, title: string, value: number}|{icon: IconDefinition, label: string, title: string, value: number}}
     */
    static modeFromGIStoLGS = () => {
        switch (lgs.scene.mode) {
            case SceneMode.SCENE2D:
                return SCENE_MODE_2D
            case SceneMode.SCENE3D:
                return SCENE_MODE_3D
            case SceneMode.COLUMBUS_VIEW:
                return SCENE_MODE_COLUMBUS
            default:
                return SCENE_MODE_3D
        }
    }

    static modeFromLGSToGIS = (mode = lgs.settings.scene.mode.value) => {
        switch (mode.value) {
            case SCENE_MODE_2D.value:
                return SceneMode.SCENE2D
            case SCENE_MODE_3D.value:
                return SceneMode.SCENE3D
            case SCENE_MODE_COLUMBUS.value:
                return SceneMode.COLUMBUS_VIEW
            default:
                return SceneMode.SCENE3D
        }
    }

    static getPixelsCoordinates = point => {
        return lgs.scene.cartesianToCanvasCoordinates(
            Cartesian3.fromDegrees(point.longitude, point.latitude,
                                   __.ui.sceneManager.noRelief() ? 0 : point.elevation))
    }


}