import React, { Component } from 'react'
import { connect } from 'react-redux'

import * as modalCreators from '../../../redux/actions/modalCreators'
import * as postCreators from '../../../redux/actions/postCreators'
import API from '../../../services/api'

import './modals.css'

class ModalContainer extends Component {
  constructor (props) {
    super(props)

    this.state = {
      title: '',
      content: '',
      hashtags: ''
    }

    this.closeModal = this.closeModal.bind(this)
    this.openModal = this.openModal.bind(this)
    this.handleOnTitleChange = this.handleOnTitleChange.bind(this)
    this.handleOnContentChange = this.handleOnContentChange.bind(this)
    this.handleOnHashtagChange = this.handleOnHashtagChange.bind(this)
    this.selectForm = this.selectForm.bind(this)
    this.handlePost = this.handlePost.bind(this)
  }

  closeModal () {
    this.props.closeModal()
  }

  openModal () {
    this.props.openModal()
  }

  handlePost () {
    const { title, content, hashtags } = this.state
    const { user, addNewPost } = this.props
    // console.log(`Data: title ${title}, content ${content}, hastag ${hashtags}`)
    API.saveTextPost({
      postType: 'text',
      author: user.id,
      text: content,
      hashtags: hashtags.split('\n')
    }).then(data => {
      this.setState({ title: '', content: '', hashtags: '' })
      addNewPost(data)
    })
  }

  handleOnTitleChange (evt) {
    this.setState({ title: evt.target.value })
  }

  handleOnContentChange (evt) {
    this.setState({ content: evt.target.value })
  }

  handleOnHashtagChange (evt) {
    this.setState({ hashtags: evt.target.value })
  }

  selectForm () {
    const { title, content, hashtags } = this.state
    const { modalType } = this.props
    switch (modalType) {
      case 'text':
      default:
        return (
          <TextForm
            title={title}
            content={content}
            hashtags={hashtags}
            changeTitle={this.handleOnTitleChange}
            changeContent={this.handleOnContentChange}
            changeHashtag={this.handleOnHashtagChange}
          />
        )
    }
  }

  render () {
    const { isModalVisible, modalType, user } = this.props

    const ModalHeader = (
      <section className='post-modal__header'>
        <div className='post-modal__user-info'>
          <p>{user.username}</p>
          <i className='glyphicon glyphicon-chevron-down' />
        </div>
        <img className='post-modal__header-img'
          src='/assets/img/modal/settings.svg'
          alt='settings' />
      </section>
    )

    const ModalBody = (
      <section className='post-modal__body'>
        {this.selectForm(modalType)}
      </section>
    )

    const ModalFooter = (
      <section className='post-modal__footer'>
        <button className='post-modal__close'
          onClick={this.closeModal}
        >
          CLOSE
        </button>
        <div className='post-modal__footer-right'>
          <img src='/assets/img/modal/twitter.svg' alt='twitter' />
          <button onClick={this.handlePost}>
            POST <i className='glyphicon glyphicon-chevron-down' />
          </button>
        </div>
      </section>
    )

    return (
      isModalVisible
        ? (
          <div className='post-modal__container'>
            <div className='row'>
              <main className='col-md-offset-3 col-md-6 post-modal'>
                {ModalHeader}
                {ModalBody}
                {ModalFooter}
              </main>
            </div>
          </div>
        ) : null
    )
  }
}

const TextForm = ({ title, content, hashtags,
  changeTitle, changeContent, changeHashtag
}) => (
  <section className='text-form'>
    <input className='text-form__title'
      value={title}
      placeholder='Title'
      type='text'
      onChange={changeTitle}
    />
    <input className='text-form__content'
      value={content}
      type='text'
      onChange={changeContent}
    />
    <input className='text-form__hastags'
      value={hashtags}
      placeholder='#hastags'
      type='text'
      onChange={changeHashtag}
    />
  </section>
)

const mapStateToProps = state => ({
  isModalVisible: state.isModalVisible,
  user: state.user,
  modalType: state.modalType
})

export default connect(mapStateToProps, { ...modalCreators, ...postCreators })(ModalContainer)
