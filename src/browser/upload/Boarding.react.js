import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import shouldPureComponentUpdate from 'react-pure-render/function';
import { injectIntl, intlShape } from 'react-intl';
import Helmet from 'react-helmet';
import uploadMessages from '../../common/upload/uploadMessages';
import Dropzone from 'react-dropzone';
import Card from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import CardActions from 'material-ui/Card/CardActions';
import { cyan500 } from 'material-ui/styles/colors';
import { upload } from '../../common/upload/actions';

class Boarding extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    upload: PropTypes.func.isRequired,
  }

  constructor(props, context) {
    super(props, context);

    this.handleDrop = this.handleDrop.bind(this);
  }

  shouldComponentUpdate = shouldPureComponentUpdate;

  handleDrop(files) {
    // const { upload } = this.props;

    // upload(files);
  }


  render() {
    const { intl } = this.props;
    const title = intl.formatMessage(uploadMessages.boardingTitle);
    const boardingInstruction = intl.formatMessage(uploadMessages.dropFileInstruction);

    const styles = {
      dropzone: {
        position: 'relative',
        border: '10px dotted',
        borderColor: cyan500,
        borderRadius: '20px',
        color: cyan500,
        font: 'bold 24px/200px',
        height: '200px',
        lineHeight: '200px',
        margin: '30px auto',
        textAlign: 'center',
        width: '80%',
      },
      dropzoneContent: {
        display: 'inline-block',
        verticalAlign: 'middle',
        lineHeight: 'normal',
      }
    };

    return (
      <div>
        <Helmet title={title} />
          <Card>
            <CardHeader title={title} />
            <CardActions>
              <div>
                <Dropzone
                  style={styles.dropzone}
                  multiple={false}
                  accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  onDrop={this.handleDrop}
                >
                  <p style={styles.dropzoneContent}>
                    {boardingInstruction}
                  </p>
                </Dropzone>
              </div>
            </CardActions>
          </Card>
      </div>
    );
  }
}


Boarding = injectIntl(Boarding);

export default connect(state => ({
  note: state.ui.selectedNote,
}), {
  upload
})(Boarding);
