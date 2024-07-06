import { useEffect, useRef } from 'react'
import { useSnapshot }       from 'valtio'
import {
    DRAG_AND_DROP_FILE_ACCEPTED, DRAG_AND_DROP_FILE_PARTIALLY, DRAG_AND_DROP_FILE_REJECTED, DRAG_AND_DROP_FILE_WAITING,
    DRAG_AND_DROP_STATUS_TIMER, FileUtils,
}                            from '../../Utils/FileUtils'

/**
 * From : https://www.codemzy.com/blog/react-drag-drop-file-upload
 *
 * @return {JSX.Element}
 * @constructor
 */

export const DragNDropFile = (props) => {

    const setState = lgs.mainProxy.components.fileLoader
    const getState = useSnapshot(setState)
    var fileList = setState.fileList

    const inputRef = useRef(null)

    const classes = props.classes ?? 'drag-and-drop-container'
    const id = props.id ?? 'drag-and-drop-file'

    const acceptedTypes = props.types.map(type => {
        if (!type.startsWith('.')) {
            type = '.' + type
        }
    })

    const IMPROPER_FORMAT = 'File format not supported!'
    const SOME_IMPROPER_FORMAT = 'Not all files format are supported!'


    /**
     * Cancel event
     *
     * @param event
     */
    const cancelEvent = (event) => {
        event.preventDefault()
        event.stopPropagation()
    }

    /**
     * Drag start event
     *
     * @param event
     *
     * Calls props.onDragEnter event
     */
    const onDragStart = (event) => {
        cancelEvent(event)
        setState.dragging.active = true
        if (props.onDragStart) {
            props.onDragStart()
        }
    }

    /**
     * Window Drag Enter event
     *
     * @param event
     */
    const onWindowDragEnter = (event) => {
        cancelEvent(event)
        if (props.detectWindowDrag) {
            setState.dragging.active = true
        }
    }

    /**
     * Drag enter event
     *
     * @param event
     *
     * Calls props.onDragEnter event
     */
    const onDragEnter = (event) => {
        cancelEvent(event)
        if (!props.detectWindowDrag) {
            setState.dragging.active = true
        }
        if (props.onDragEnter) {
            props.onDragEnter()
        }

    }

    /**
     * Drag over event
     *
     * @param event
     *
     * Calls props.onDragOver event
     */
    const onDragOver = (event) => {
        cancelEvent(event)
        setState.dragging.active = true
        if (props.onDragOver) {
            props.onDragOver(event)
        }

    }


    /**
     * Window Drag Leave event
     *
     * @param event
     */
    const onWindowDragLeave = (event) => {
        cancelEvent(event)
        if (props.detectWindowDrag) {
            setState.dragging.active = false
        }
    }

    /**
     * Drag leave event
     *
     * @param event
     *
     * Calls props.onDragLeave event
     */
    const onDragLeave = (event) => {
        cancelEvent(event)
        if (!props.detectWindowDrag) {
            setState.dragging.active = false
        }

        if (props.onDragLeave) {
            props.onDragLeave(event)
        }
    }

    /**
     * Drag end event
     *
     * @param event
     *
     * Calls props.onDragLeave event
     */
    const onDragEnd = (event) => {
        cancelEvent(event)
        setState.dragging.active = false
        if (props.onDragEnd) {
            props.onDragEnd(event)
        }
    }

    /**
     * Drop event
     *
     * @param event
     *
     * Calls props.onDrop event
     */
    const onDrop = (event) => {
        cancelEvent(event)
        setState.dragging.active = false

        const list = new Map()
        const files = event.dataTransfer.files
        for (const file of files) {
            const tmp = validate(file)
            FileUtils.readFileAsText(file, props.manageContent ?? null)
            list.set(__.app.slugify(`${file.name}`),
                     {
                              file:   {
                                  date: file.lastModified,
                                  fullName:  file.name,
                                  name:      tmp.file.name,
                                  extension: tmp.file.extension,
                                  type: file.type,
                                  size: file.size,
                              },
                              status: tmp.status,
                              error:  tmp.error,
                     }
            )

        }
        if (list.size >0) {
            // Add to existing file list
            list.forEach((item,key)=>{
                fileList.set(key,item)
            })

            // Use callback if defined
            if (props.onDrop) {
                props.onDrop(list)
            }

            // Check if  all are ok or wrong or only some of them
            let allTrue = Array.from(list.values()).every(item =>  item.status === true)
            let allFalse = Array.from(list.values()).every(item => item.status === false)

            // The set state and error messages accordingly
            if (allTrue) {
                setState.accepted = DRAG_AND_DROP_FILE_ACCEPTED
            }
            else if (allFalse) {
                setState.accepted = DRAG_AND_DROP_FILE_REJECTED
                setState.error = IMPROPER_FORMAT
            }
            else {
                setState.accepted = DRAG_AND_DROP_FILE_PARTIALLY
                setState.error = SOME_IMPROPER_FORMAT
            }


            // After some seconds, return to normal state
            setTimeout(() => {
                setState.accepted = DRAG_AND_DROP_FILE_WAITING
            }, DRAG_AND_DROP_STATUS_TIMER)


        }
    }

    /**
     * Drag enter event
     *
     * @param event
     *
     * Calls props.onDragEnter event
     */
    const onChange = (event) => {
        cancelEvent(event)
        setState.dragging.active = false
        if (event.target.files && event.target.files[0]) {
            // handleFiles(event.target.file
        }
    }

    /**
     * Validate file
     *
     * The only test done here consists of testing the extendion.
     * Other can be done in  props.validate functopn that returns {status:boolean,error:message}
     *
     * @param file
     *
     * @return {{error: string, status: boolean}}
     */
    const validate = (file) => {
        let check = {status: true, message: ''}
        const fileInfo = FileUtils.getFileNameAndExtension(file.name)

        if (props.types.includes(fileInfo.extension)) {
            if (props.validate) {
                check = props.validate(file)
            }
        }
        else {
            check.status = false
            check.error = IMPROPER_FORMAT
        }

        check.file = fileInfo
        return check
    }

    // triggers the input when the drop zone is clicked
    const launchFilesSelector = (event) => {
        inputRef.current.click()
        cancelEvent(event)
    }

    /**
     *
     */
    useEffect(() => {
        window.addEventListener('dragenter', onWindowDragEnter)
        window.addEventListener('dragleave', onWindowDragLeave)
        window.addEventListener('dragend', onWindowDragLeave)

        // //window.addEventListener('dragend', onWindowDragLeave);
        // return () => {
        //     window.removeEventListener('dragenter', onWindowDragEnter);
        //     window.removeEventListener('dragleave', onWindowDragLeave);
        //     window.removeEventListener('dragend', onWindowDragLeave);
        //
        // }
    }, [])


    return (
        <>
            <input ref={inputRef} type="file"
                   accept={acceptedTypes}
                   id="drag-and-drop-input-file-upload"
                   multiple={props.multiple}
                   onChange={onChange}
                   style={{display: 'none'}}
            />
            <div id={id}
                 style={{width: '100%', 'height': '100%'}}
                 className={getState.dragging.active ? `${classes} drag-active` : classes}
                 onClick={launchFilesSelector}
                 onDragEnter={onDragEnter}
                 onDragLeave={onDragLeave}
                 onDragEnd={onDragEnd}
                 onDragOver={onDragOver}
                 onDrop={onDrop}
                 onDragStart={onDragStart}
            >
                {props.children}
            </div>
        </>
    )
}