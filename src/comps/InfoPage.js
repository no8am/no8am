import React from 'react';
import {
  Paper, 
  Modal, 
  Backdrop, 
  Fade
} from '@material-ui/core';
import * as contentful from "contentful";
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import DOMPurify from 'dompurify';

const InfoPage = (props) => {

    const {open, handleClose, classes, modalWidth} = props;
    
    const DATA_TYPES = ['guides']
    const [CMSData, setCMSData] = React.useState(DATA_TYPES.reduce((key,val) => (key[val]={}, key),{}));
    const client = contentful.createClient({
        space: process.env.REACT_APP_CONTENTFUL_ID,
        accessToken: process.env.REACT_APP_CONTENTFUL_KEY,
    });
    const getDataForItem = async (id = '') => {
        client.getEntries({
            content_type: id
        })
        .then((entries) => {
            const oldObj = {...CMSData}
            entries.items.forEach((entry) => {
                oldObj[id][entry.sys.id] = entry
            })
            setCMSData(oldObj)
        })
    }

    React.useEffect(() => {
      getDataForItem(DATA_TYPES[0]);
      DOMPurify.addHook('afterSanitizeAttributes', function (node) {
        if ('target' in node) { node.setAttribute('target', '_blank'); }
        if (!node.hasAttribute('target') && (node.hasAttribute('xlink:href') || node.hasAttribute('href'))) {
          node.setAttribute('xlink:show', 'new');
        }
      });
    }, [])
    const data = Object.values(CMSData[DATA_TYPES[0]])[0]?.fields;

    return (
      <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      style={{width: modalWidth, overflow: 'scroll', maxHeight: '80vh'}}
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      >
        <Fade in={open}>
          <Paper style={{padding: "20px"}}>
            <h1>{data?.title}</h1>
            <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(documentToHtmlString(data?.body))}} />
          </Paper>
        </Fade>
      </Modal>
    )
}

export default InfoPage;