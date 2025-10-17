import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import {
  Message,
  ChatRoom as ChatRoomType,
  Profile,
  getMessages,
  sendMessage,
  subscribeToMessages,
  getProfile,
  getOrCreateChatRoom,
  getMyChatRooms,
  getUnreadCount,
  markRoomMessagesAsRead,
} from '../lib/supabase'
import './ChatRoom.css'

interface ChatRoomProps {
  otherProfileId?: string
  onClose?: () => void
}

const ChatRoom: React.FC<ChatRoomProps> = ({ otherProfileId, onClose }) => {
  const { user, profile: currentProfile } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [chatRoom, setChatRoom] = useState<ChatRoomType | null>(null)
  const [otherProfile, setOtherProfile] = useState<Profile | null>(null)
  const [myChatRooms, setMyChatRooms] = useState<ChatRoomType[]>([])
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)
  const [roomProfiles, setRoomProfiles] = useState<Map<string, Profile>>(new Map())
  const [roomUnreadCounts, setRoomUnreadCounts] = useState<Map<string, number>>(new Map())
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const loadMyChatRooms = useCallback(async () => {
    if (!currentProfile) return

    try {
      const rooms = await getMyChatRooms(currentProfile.id)
      setMyChatRooms(rooms)

      // 각 채팅방의 상대방 프로필과 안 읽은 메시지 수 로드
      const profiles = new Map<string, Profile>()
      const unreadCounts = new Map<string, number>()

      for (const room of rooms) {
        const otherParticipantId =
          room.participant1_id === currentProfile.id
            ? room.participant2_id
            : room.participant1_id

        try {
          const profile = await getProfile(otherParticipantId)
          if (profile) {
            profiles.set(room.id, profile)
          }
        } catch (error) {
          console.error('프로필 로드 오류:', error)
        }

        try {
          const count = await getUnreadCount(room.id, currentProfile.id)
          unreadCounts.set(room.id, count)
        } catch (error) {
          console.error('안 읽은 메시지 수 로드 오류:', error)
        }
      }

      setRoomProfiles(profiles)
      setRoomUnreadCounts(unreadCounts)
    } catch (error) {
      console.error('채팅방 목록 로드 오류:', error)
    }
  }, [currentProfile])

  const loadChatRoom = useCallback(async (roomId: string) => {
    try {
      const room = myChatRooms.find((r) => r.id === roomId)
      if (!room) return

      setChatRoom(room)

      // Load other participant's profile
      const otherParticipantId =
        room.participant1_id === currentProfile?.id
          ? room.participant2_id
          : room.participant1_id

      const profile = await getProfile(otherParticipantId)
      setOtherProfile(profile)
    } catch (error) {
      console.error('채팅방 로드 오류:', error)
    }
  }, [myChatRooms, currentProfile])

  const initializeChatRoom = useCallback(async () => {
    if (!currentProfile || !otherProfileId) return

    setLoading(true)
    try {
      const room = await getOrCreateChatRoom(currentProfile.id, otherProfileId)
      setChatRoom(room)

      const profile = await getProfile(otherProfileId)
      setOtherProfile(profile)
    } catch (error) {
      console.error('채팅방 초기화 오류:', error)
      alert('채팅방을 불러오는 데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }, [currentProfile, otherProfileId])

  const loadMessages = useCallback(async () => {
    if (!chatRoom || !currentProfile) return

    try {
      const msgs = await getMessages(chatRoom.id)
      setMessages(msgs)

      // 메시지를 읽음 처리
      await markRoomMessagesAsRead(chatRoom.id, currentProfile.id)

      // 채팅방 목록과 안 읽은 메시지 수 즉시 업데이트
      await loadMyChatRooms()

      // 전역 이벤트 발생시켜 Navbar의 안 읽은 메시지 수도 업데이트
      window.dispatchEvent(new CustomEvent('messages-read', { detail: { roomId: chatRoom.id } }))
    } catch (error) {
      console.error('메시지 로드 오류:', error)
    }
  }, [chatRoom, currentProfile, loadMyChatRooms])

  useEffect(() => {
    if (currentProfile && !otherProfileId) {
      loadMyChatRooms()
    }
  }, [currentProfile, otherProfileId, loadMyChatRooms])

  useEffect(() => {
    if (currentProfile && otherProfileId) {
      initializeChatRoom()
    }
  }, [currentProfile, otherProfileId, initializeChatRoom])

  useEffect(() => {
    if (selectedRoomId) {
      loadChatRoom(selectedRoomId)
    }
  }, [selectedRoomId, loadChatRoom])

  useEffect(() => {
    if (chatRoom) {
      loadMessages()

      // Supabase 실시간 구독
      const subscription = subscribeToMessages(chatRoom.id, async (newMsg) => {
        setMessages((prev) => [...prev, newMsg])
        scrollToBottom()

        // 상대방이 보낸 메시지면 즉시 읽음 처리
        if (newMsg.sender_id !== currentProfile?.id && currentProfile) {
          await markRoomMessagesAsRead(chatRoom.id, currentProfile.id)
          loadMyChatRooms() // 안 읽은 메시지 수 업데이트
        }
      })

      // localStorage 기반 실시간 메시지 (개발용 폴백 - 같은 탭)
      const handleNewMessage = async (event: Event) => {
        const customEvent = event as CustomEvent
        const newMsg = customEvent.detail as Message
        if (newMsg.room_id === chatRoom.id) {
          setMessages((prev) => {
            // 중복 방지
            if (prev.some(m => m.id === newMsg.id)) return prev
            return [...prev, newMsg]
          })
          scrollToBottom()

          // 상대방이 보낸 메시지면 즉시 읽음 처리
          if (newMsg.sender_id !== currentProfile?.id && currentProfile) {
            await markRoomMessagesAsRead(chatRoom.id, currentProfile.id)
            loadMyChatRooms() // 안 읽은 메시지 수 업데이트
          }
        }
      }

      // localStorage storage 이벤트 (다른 탭/창에서의 메시지)
      const handleStorageChange = async (event: Event) => {
        const storageEvent = event as StorageEvent
        if (storageEvent.key === `messages_${chatRoom.id}` && storageEvent.newValue) {
          const allMessages = JSON.parse(storageEvent.newValue) as Message[]
          setMessages((prev) => {
            const lastMessage = allMessages[allMessages.length - 1]
            // 마지막 메시지가 현재 목록에 없으면 추가
            if (lastMessage && !prev.some(m => m.id === lastMessage.id)) {
              scrollToBottom()

              // 상대방이 보낸 메시지면 읽음 처리
              if (lastMessage.sender_id !== currentProfile?.id && currentProfile) {
                markRoomMessagesAsRead(chatRoom.id, currentProfile.id).then(() => {
                  loadMyChatRooms() // 안 읽은 메시지 수 업데이트
                })
              }

              return [...prev, lastMessage]
            }
            return prev
          })
        }
      }

      window.addEventListener('new-message', handleNewMessage)
      window.addEventListener('storage', handleStorageChange)

      return () => {
        subscription.unsubscribe()
        window.removeEventListener('new-message', handleNewMessage)
        window.removeEventListener('storage', handleStorageChange)
      }
    }
  }, [chatRoom, loadMessages, scrollToBottom, currentProfile, loadMyChatRooms])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !chatRoom || !currentProfile || sending) return

    const messageContent = newMessage.trim()
    setSending(true)
    setNewMessage('') // 즉시 입력창 비우기

    try {
      // 임시 메시지 추가 (즉각적인 피드백)
      const tempMessage: Message = {
        id: `temp-${Date.now()}`,
        room_id: chatRoom.id,
        sender_id: currentProfile.id,
        content: messageContent,
        is_read: false,
        created_at: new Date().toISOString()
      }

      setMessages((prev) => [...prev, tempMessage])
      scrollToBottom()

      // 실제 전송
      const sentMessage = await sendMessage(chatRoom.id, currentProfile.id, messageContent)

      // 임시 메시지를 실제 메시지로 교체
      setMessages((prev) =>
        prev.map(m => m.id === tempMessage.id ? sentMessage : m)
      )

      // 입력창에 포커스
      inputRef.current?.focus()
    } catch (error) {
      console.error('메시지 전송 오류:', error)
      setNewMessage(messageContent) // 실패 시 메시지 복구

      // 임시 메시지 제거
      setMessages((prev) => prev.filter(m => !m.id.startsWith('temp-')))

      alert('메시지 전송에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setSending(false)
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const ampm = hours >= 12 ? '오후' : '오전'
    const displayHours = hours % 12 || 12
    return `${ampm} ${displayHours}:${minutes.toString().padStart(2, '0')}`
  }

  if (!user) {
    return (
      <div className="chat-room-container">
        <div className="chat-placeholder">
          <div className="placeholder-icon">💬</div>
          <p>로그인이 필요합니다.</p>
          <p className="placeholder-subtitle">채팅을 시작하려면 먼저 로그인해주세요.</p>
        </div>
      </div>
    )
  }

  if (!currentProfile) {
    return (
      <div className="chat-room-container">
        <div className="chat-placeholder">
          <div className="placeholder-icon">👤</div>
          <p>프로필을 먼저 작성해주세요.</p>
          <p className="placeholder-subtitle">채팅을 사용하려면 프로필이 필요합니다.</p>
        </div>
      </div>
    )
  }

  if (!otherProfileId && !selectedRoomId) {
    return (
      <div className="chat-room-container">
        <div className="chat-list-view">
          <div className="chat-list-header">
            <h2>메시지</h2>
          </div>

          {myChatRooms.length === 0 ? (
            <div className="chat-placeholder">
              <div className="placeholder-icon">💬</div>
              <p>아직 대화가 없습니다.</p>
              <p className="placeholder-subtitle">
                참가자 탐색에서 관심 있는 분에게 메시지를 보내보세요!
              </p>
            </div>
          ) : (
            <div className="chat-rooms-list">
              {myChatRooms.map((room) => {
                const otherProfile = roomProfiles.get(room.id)
                const unreadCount = roomUnreadCounts.get(room.id) || 0
                return (
                  <div
                    key={room.id}
                    className="chat-room-item"
                    onClick={() => setSelectedRoomId(room.id)}
                  >
                    <div className="chat-room-avatar">
                      {otherProfile?.avatar_url ? (
                        <img src={otherProfile.avatar_url} alt={otherProfile.name} />
                      ) : (
                        <div className="avatar-placeholder">
                          {otherProfile?.name?.charAt(0) || '?'}
                        </div>
                      )}
                    </div>
                    <div className="chat-room-info">
                      <h4>{otherProfile?.name || '알 수 없음'}</h4>
                      <p className="chat-room-preview">
                        {otherProfile?.company || otherProfile?.role || ''}
                      </p>
                    </div>
                    <div className="chat-room-meta">
                      <p className="chat-room-date">
                        {new Date(room.updated_at).toLocaleDateString('ko-KR', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                      {unreadCount > 0 && (
                        <span className="chat-unread-badge">{unreadCount}</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="chat-room-container">
        <div className="chat-placeholder">
          <p>채팅방을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="chat-room-container">
      <div className="chat-room">
        <div className="chat-header">
          {onClose && (
            <button className="back-button" onClick={onClose}>
              ←
            </button>
          )}
          {selectedRoomId && !otherProfileId && (
            <button
              className="back-button"
              onClick={() => {
                setSelectedRoomId(null)
                setChatRoom(null)
                setOtherProfile(null)
              }}
            >
              ←
            </button>
          )}

          <div className="chat-header-info">
            {otherProfile?.avatar_url ? (
              <img src={otherProfile.avatar_url} alt={otherProfile.name} />
            ) : (
              <div className="chat-avatar-placeholder">
                {otherProfile?.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h3>{otherProfile?.name}</h3>
              {otherProfile?.role && <p>{otherProfile.role}</p>}
            </div>
          </div>
        </div>

        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="no-messages">
              <p>대화를 시작해보세요!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`message ${
                  msg.sender_id === currentProfile.id ? 'message-sent' : 'message-received'
                }`}
              >
                <div className="message-content">
                  <p>{msg.content}</p>
                  <span className="message-time">
                    {formatTime(msg.created_at)}
                    {msg.sender_id === currentProfile.id && (
                      <span className="message-status">
                        {msg.id.startsWith('temp-') ? ' ⏳' : msg.is_read ? ' ✓✓' : ' ✓'}
                      </span>
                    )}
                  </span>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="chat-input-form">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="메시지를 입력하세요..."
            className="chat-input"
            ref={inputRef}
            disabled={sending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="send-button"
          >
            {sending ? '⏳' : '📤'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatRoom
