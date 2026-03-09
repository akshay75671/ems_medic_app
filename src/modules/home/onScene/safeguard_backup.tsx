import React, {FC, useState, useEffect, useRef} from 'react';
import {
  Dimensions,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Carousel, {Pagination, ParallaxImage} from 'react-native-snap-carousel';

import {
  boxModelSize,
  Colors,
  commonStyles,
  Fonts,
  fontSize,
} from '../../../styles';
import {
  BottomNavigation,
  CustButton,
  CustIcon,
  SafeguardCustomMultiPicker,
  CustTextInput,
  PatientDetailsHeader,
  OnSceneMenu,
  ScanScreen,
} from '../../../components';
import Constants from '../../../core/constants';
import {scale} from 'react-native-size-matters';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {HomeDrawerMenuParamList} from '../../../types/navigationsTypes';
import Modal from 'react-native-modal';
import {inject, observer} from 'mobx-react';

type drawerNavigationProp = DrawerNavigationProp<HomeDrawerMenuParamList>;
type navigationProps = {
  navigation: drawerNavigationProp;
  safeguard: any;
  assistRequests: any;
  attendeeID: any;
};

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

const Safeguard: FC<navigationProps> = (props) => {
  const [attendeeID, setAttendeeID] = useState<string>();
  const [
    onToggleAddSafeguardItemPopup,
    setOnToggleAddSafeguardItemPopup,
  ] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [onSceneMenu, setOnSceneMenu] = useState<boolean>(false);
  const [medicineName, setMedicineName] = useState<string>();
  const [medicineNameError, setMedicineNameError] = useState<string>('');
  const [safeguardNotes, setSafeguardNotes] = useState<string>();
  const [safeguardNotesError, setSafeguardNotesError] = useState<string>();
  const [quantity, setQuantity] = useState<string>();
  const [quantityError, setQuantityError] = useState<string>('');
  const [unit, setUnit] = useState<string>();
  const [unitError, setUnitError] = useState<string>('');
  const [selectedSafeguard, setSelectedSafeguard] = useState([]);
  const [isCut, setIsCut] = useState(false);
  // QR Code States
  const [qrCodeModal, setQrCodeModal] = useState<boolean>(false);
  // Search Modal States
  const [searchModal, setSearchModal] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  // for Image sliders
  const [activeMedsIndex, setActiveMedsIndex] = useState(0);
  const [entries, setEntries] = useState([
    {
      title: 'Glycine Combination Tablets',
      subtitle: 'Brand: Poly Care Herbals',
      illustration:
        'https://ak.picdn.net/shutterstock/videos/1016544112/thumb/1.jpg',
    },
    {
      title: 'Centrocare 0.25mg',
      subtitle: 'Pharmaceutical Injectables in Vadodara',
      illustration:
        'https://3.imimg.com/data3/WH/IV/MY-7557232/generic-classic-medicine-tablet-500x500.jpeg',
    },
    {
      title: 'Runner Veterinary Tablet',
      subtitle: 'Runner Veterinary Tablet',
      illustration:
        'https://3.imimg.com/data3/PI/HH/MY-16510276/runner-tablets-500x500.jpg',
    },
    {
      title: 'Griseofulvin',
      subtitle: 'Griseofulvin',
      illustration:
        'https://w7.pngwing.com/pngs/560/755/png-transparent-pharmaceutical-drug-medical-prescription-prescription-drug-combined-oral-contraceptive-pill-tablet-pills-miscellaneous-electronics-sweetness.png',
    },
    {
      title: 'Genuine Quality Online Real Steroids UK',
      subtitle: 'Genuine Quality Online Real Steroids UK',
      illustration:
        'https://www.thehomeofsteroids.com/blog/wp-content/uploads/2014/01/steroids.jpg',
    },
  ]);
  const medsCarouselRef = useRef(null);
  const rxCarouselRef = useRef(null);

  let safeguardsList = [];
  interface fieldsType {
    value: string;
    error: string;
  }

  interface ISafeguardItem {
    id: number /*Safeguard ID */;
    medicineName: string;
    quantity: number;
    unit: string;
  }

  interface IAddSafeguardPopupState {
    id: string;
    medicineName: fieldsType;
    quantity: fieldsType;
    unit: fieldsType;
  }

  const addSafeguardItemHandler = () => {
    const safeguardItemObj = {} as ISafeguardItem;

    safeguardItemObj.medicineName = medicineName;
    safeguardItemObj.quantity = +quantity;
    safeguardItemObj.unit = unit;
    safeguardItemObj.id = Math.round(Math.random() * 1000000);
    props.safeguard.setSafeguard(safeguardItemObj, attendeeID);
    toggleAddSafeguardItemPopup();
    setMedicineName('');
    setMedicineNameError('');
    setSafeguardNotesError('');
    setQuantity('');
    setQuantityError('');
    setUnit('');
    setQuantityError('');
  };

  const goForward = () => {
    medsCarouselRef.current.snapToNext();
  };

  const cutSafeguardItemHandler = () => {
    console.log('cutSafeguardItemHandler');
    console.log(JSON.stringify(selectedSafeguard));
    props.safeguard.deleteSafeguard(attendeeID, selectedSafeguard);
    setIsCut(true);
  };

  const copySafeguardItemHandler = () => {
    setIsCut(false);
  };

  const pasteSafeguardItemHandler = () => {
    selectedSafeguard.forEach((element) => {
      props.safeguard.setSafeguard(element, attendeeID);
    });
    setIsCut(false);
    setSelectedSafeguard([]);
  };
  const deleteSafeguardItemHandler = () => {
    props.safeguard.deleteSafeguard(attendeeID, selectedSafeguard);
    setSelectedSafeguard([]);
  };
  const editSafeguardItemHandler = () => {
    setEditMode(true);
    toggleAddSafeguardItemPopup();
    selectedSafeguard.forEach((element) => {
      setMedicineName(element.medicineName);
      setQuantity(element.quantity.toString());
      setUnit(element.unit);
    });
    const safeguardItemObj = {} as ISafeguardItem;
    safeguardItemObj.medicineName = medicineName;
    safeguardItemObj.quantity = +quantity;
    safeguardItemObj.unit = unit;
    props.safeguard.setSafeguard(safeguardItemObj, attendeeID);
    toggleAddSafeguardItemPopup();
    setMedicineName('');
    setMedicineNameError('');
    setSafeguardNotesError('');
    setQuantity('');
    setQuantityError('');
    setUnit('');
    setQuantityError('');
  };

  const toggleAddSafeguardItemPopup = () => {
    console.log('Opening modal');
    setOnToggleAddSafeguardItemPopup(!onToggleAddSafeguardItemPopup);
  };

  const toggleOnSceneMenu = () => {
    setOnSceneMenu(!onSceneMenu);
  };

  // const _renderItem = ({item,index}) => {
  // 	return (
  // 		<View style={{
  // 				borderWidth: 2,
  // 				backgroundColor: Colors.primary,
  // 				borderRadius: 5,
  // 				// height: 50,
  // 				padding: 10,
  // 				// marginLeft: 25,
  // 				marginRight: 25,
  // 				}}>
  // 			<Text style={{fontSize: 30, color: Colors.white}}>{item.title}</Text>
  // 			<Text style={{color: Colors.white}}>{item.text}</Text>
  // 		</View>

  // 	)
  // }

  const renderItem = ({item, index}, parallaxProps) => {
    return (
      <View style={styles.item}>
        <ParallaxImage
          source={{uri: item.uri}}
          containerStyle={styles.imageContainer}
          style={styles.image}
          parallaxFactor={0.4}
          {...parallaxProps}
        />
        <View
          style={{
            backgroundColor: 'rgba(25, 25, 25, 0.75)',
          }}>
          <Text style={styles.title} numberOfLines={2}>
            {item.medicineName}
          </Text>
        </View>
      </View>
    );
  };

  const assistProfileChanged = (assistObj) => {
    setAttendeeID(assistObj.id);
  };
  const assistProfileClicked = () => {};
  const goBack = () => {
    if (props.navigation.canGoBack) props.navigation.goBack();
  };

  const toggleQrCodeModal = () => {
    setQrCodeModal(!qrCodeModal);
  };

  const toggleSearchModal = () => {
    setSearchModal(!searchModal);
  };

  const handleQrCodeScan = async (value) => {
    console.log('Value');
    console.log(value);
    let newAttendeeID = value.split(':')[1];
    await props.safeguard.fetchSafeguard(newAttendeeID);
    setAttendeeID(newAttendeeID);
    setQrCodeModal(false);
  };

  const handleImageUpload = (type) => {};

  const handleQuantityChange = (type, medicineName) => {
    props.safeguard.updateSafeguard(
      {medicineName: medicineName, quantity: 6},
      attendeeID,
    );
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      {/* Search Modal */}
      <Modal
        isVisible={searchModal}
        deviceWidth={screenWidth}
        deviceHeight={screenHeight}
        onBackdropPress={() => setSearchModal(false)}
        onSwipeComplete={() => setSearchModal(false)}
        swipeDirection="left">
        {/* START: Body */}
        <View style={{flex: 1, backgroundColor: Colors.white}}>
          <Animatable.View duration={500} delay={0} animation="fadeInUp">
            <CustTextInput
              // label="Quantity"
              placeholder="start typing..."
              onChangeText={(text) => setSearchText(text)}
              onEndEditing={() => {}}
              // errorText={quantityError}
              value={searchText}
              textPaddingLeft={10}
              height={80}
              // required
            />
          </Animatable.View>
          {props.safeguard.safeguards.searchedAssistUsers.length ? (
            <Text>Result List</Text>
          ) : searchText ? (
            <View>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <CustIcon
                  color={Colors.primary}
                  type="MaterialIcons"
                  name="sentiment-dissatisfied"
                  size={60}
                />
              </View>
              <Text style={{alignSelf: 'center', color: Colors.iconGrey}}>
                Empty Results
              </Text>
            </View>
          ) : (
            <Text style={{alignSelf: 'center', color: Colors.iconGrey}}>
              Search the Assist Users
            </Text>
          )}
        </View>
      </Modal>

      {/* QR Code Scanner */}
      <Modal
        isVisible={qrCodeModal}
        deviceWidth={screenWidth}
        deviceHeight={screenHeight}
        onBackdropPress={() => setQrCodeModal(false)}
        onSwipeComplete={() => setQrCodeModal(false)}
        swipeDirection="left"
        // customBackdrop={<View style={{flex: 1}} />}
      >
        <View style={styles.closeIconContainer}>
          <Pressable onPress={toggleQrCodeModal}>
            <View style={styles.closeIcon}>
              <CustIcon type="antdesign" name="close" size={20} />
            </View>
          </Pressable>
        </View>
        <View style={{flex: 1, borderWidth: 2, backgroundColor: Colors.black}}>
          <ScanScreen
            scanDone={(value) => handleQrCodeScan(value)}></ScanScreen>
        </View>
      </Modal>

      <View style={commonStyles.topBGContainer}>
        <View style={commonStyles.bgImageContainer}>
          <Image
            style={commonStyles.bgImage}
            source={Constants.BACKGROUND_IMAGE}
          />
        </View>
      </View>
      <View style={commonStyles.bottomBGContainer}></View>
      <View style={commonStyles.masterContainer}>
        <View style={[commonStyles.container, commonStyles.containerSpacing]}>
          <View style={styles.headerContainer}>
            <PatientDetailsHeader
              profileChanged={assistProfileChanged}
              profileClicked={assistProfileClicked}
              showCloseButton={true}
              closePage={goBack}
            />
          </View>

          <ScrollView
            style={[styles.contentContainer, {padding: boxModelSize.m}]}>
            {/* <View>
								<Text
									style={[
										commonStyles.whiteBoxTitle,
										{textAlign: 'center', paddingBottom: boxModelSize.m},
									]}>
									Safeguard
								</Text>
							</View> */}
            <View style={styles.boxShadowContainer}>
              <View style={styles.actionButtonContainer}>
                <View style={styles.actionIconContainer}>
                  <TouchableOpacity
                    style={styles.option}
                    onPress={toggleSearchModal}>
                    <View
                      style={[{flexDirection: 'row', alignItems: 'center'}]}>
                      <CustIcon
                        type="MaterialIcons"
                        name={'search'}
                        size={30}
                        color={Colors.primary}
                      />
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={styles.actionIconContainer}>
                  <TouchableOpacity
                    style={styles.option}
                    onPress={() => console.log('Handing over...')}>
                    <View
                      style={[{flexDirection: 'row', alignItems: 'center'}]}>
                      <CustIcon
                        type="MaterialIcons"
                        name={'clean-hands'}
                        size={30}
                        color={Colors.primary}
                      />
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={styles.actionIconContainer}>
                  <TouchableOpacity
                    style={styles.option}
                    onPress={() => console.log('Time Add...')}>
                    <View
                      style={[{flexDirection: 'row', alignItems: 'center'}]}>
                      <CustIcon
                        type="MaterialIcons"
                        name={'alarm-add'}
                        size={30}
                        color={Colors.primary}
                      />
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={styles.actionIconContainer}>
                  <TouchableOpacity
                    style={styles.option}
                    onPress={() => toggleQrCodeModal()}>
                    <View
                      style={[{flexDirection: 'row', alignItems: 'center'}]}>
                      <CustIcon
                        type="MaterialIcons"
                        name={'qr-code-2'}
                        size={30}
                        color={Colors.primary}
                      />
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={styles.actionIconContainer}>
                  <TouchableOpacity
                    style={styles.option}
                    onPress={() => console.log('Info')}>
                    <View
                      style={[{flexDirection: 'row', alignItems: 'center'}]}>
                      <CustIcon
                        type="MaterialIcons"
                        name={'info'}
                        size={30}
                        color={Colors.primary}
                      />
                    </View>
                  </TouchableOpacity>
                </View>

                {/* <View style={ styles.actionIconContainer}   >
									<TouchableOpacity
											style={styles.option}            
											onPress={ toggleAddSafeguardItemPopup  }
										>
										<View style={[{flexDirection: 'row', alignItems: 'center'}]}>
											<CustIcon
												type="MaterialIcons"
												name=   {'add'}
												size={30}
											color={ Colors.primary}
											/>
										</View>
									</TouchableOpacity>
								</View>

								<View style={ styles.actionIconContainer}   >
									<TouchableOpacity
										style={styles.option}
										onPress={deleteSafeguardItemHandler}   
									>
										<View style={[{flexDirection: 'row', alignItems: 'center'}]}>
											<CustIcon
												type="MaterialIcons"
												name=   {'delete'}
												size={30}
												color={ Colors.primary}
											/>
										</View>
									</TouchableOpacity>
								</View>

								<View style={ styles.actionIconContainer}   >
									<TouchableOpacity
										style={styles.option}
										onPress={copySafeguardItemHandler}    >
										<View style={[{flexDirection: 'row', alignItems: 'center'}]}>
											<CustIcon
												type="MaterialIcons"
												name=   {'file-copy'}
												size={30}
												color={ Colors.primary}
											/>
										</View>
									</TouchableOpacity>
								</View>

								<View style={ styles.actionIconContainer}   >
									<TouchableOpacity
										style={styles.option}
										onPress={ editSafeguardItemHandler  }   
									>
										<View style={[{flexDirection: 'row', alignItems: 'center'}]}>
											<CustIcon
												type="AntDesign"
												name=   {'edit'}
												size={30}
												color={ Colors.primary}
											/>
										</View>
									</TouchableOpacity>
								</View>


								<View style={ styles.actionIconContainer}   >
									<TouchableOpacity
										style={styles.option}
										onPress={pasteSafeguardItemHandler}   
									>
										<View style={[{flexDirection: 'row', alignItems: 'center'}]}>
											<CustIcon
												type="MaterialIcons"
												name=   {'content-paste'}
												size={30}
												color={ Colors.primary}
											/>
										</View>
									</TouchableOpacity>
								</View>

								<View style={ styles.actionIconContainer}   >
									<TouchableOpacity
											style={styles.option}
											onPress={cutSafeguardItemHandler}    
									>
										<View style={[{flexDirection: 'row', alignItems: 'center'}]}>
											<CustIcon
												type="MaterialIcons"
												name=   {'content-cut'}
												size={30}
												color={ Colors.primary}
											/>
										</View>
									</TouchableOpacity>
								</View> */}
              </View>
            </View>
            <View style={[styles.boxShadowContainer, {marginTop: 15}]}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    // borderWidth:2,
                    padding: scale(10),
                    marginBottom: scale(15),
                    height: scale(50),
                    flexDirection: 'row',
                    borderRadius: scale(45),
                    justifyContent: 'center',
                    alignSelf: 'flex-start',
                  }}>
                  <View style={styles.actionIconContainerCompact}>
                    <TouchableOpacity
                      style={styles.option}
                      disabled={selectedSafeguard.length ? false : true}
                      onPress={editSafeguardItemHandler}>
                      <View
                        style={[{flexDirection: 'row', alignItems: 'center'}]}>
                        <CustIcon
                          type="MaterialIcons"
                          name={'edit'}
                          size={25}
                          color={
                            selectedSafeguard.length
                              ? Colors.primary
                              : Colors.iconGrey
                          }
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.actionIconContainerCompact}>
                    <TouchableOpacity
                      style={styles.option}
                      disabled={selectedSafeguard.length ? false : true}
                      onPress={copySafeguardItemHandler}>
                      <View
                        style={[{flexDirection: 'row', alignItems: 'center'}]}>
                        <CustIcon
                          type="MaterialIcons"
                          name={'content-copy'}
                          size={25}
                          color={
                            selectedSafeguard.length
                              ? Colors.primary
                              : Colors.iconGrey
                          }
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.actionIconContainerCompact}>
                    <TouchableOpacity
                      style={styles.option}
                      disabled={selectedSafeguard.length ? false : true}
                      onPress={cutSafeguardItemHandler}>
                      <View
                        style={[{flexDirection: 'row', alignItems: 'center'}]}>
                        <CustIcon
                          type="MaterialIcons"
                          name={'content-cut'}
                          size={25}
                          color={
                            selectedSafeguard.length
                              ? Colors.primary
                              : Colors.iconGrey
                          }
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.actionIconContainerCompact}>
                    <TouchableOpacity
                      style={styles.option}
                      onPress={pasteSafeguardItemHandler}>
                      <View
                        style={[{flexDirection: 'row', alignItems: 'center'}]}>
                        <CustIcon
                          type="MaterialIcons"
                          name={'content-paste'}
                          size={25}
                          color={
                            selectedSafeguard.length
                              ? Colors.primary
                              : Colors.iconGrey
                          }
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.actionIconContainerCompact}>
                    <TouchableOpacity
                      style={styles.option}
                      disabled={selectedSafeguard.length ? false : true}
                      onPress={deleteSafeguardItemHandler}>
                      <View
                        style={[{flexDirection: 'row', alignItems: 'center'}]}>
                        <CustIcon
                          type="MaterialIcons"
                          name={'delete'}
                          size={25}
                          color={
                            selectedSafeguard.length
                              ? Colors.primary
                              : Colors.iconGrey
                          }
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
                <View
                  style={{
                    // borderWidth:2,
                    padding: scale(10),
                    marginBottom: scale(15),
                    height: scale(50),
                    flexDirection: 'row',
                    borderRadius: scale(45),
                    justifyContent: 'center',
                    alignSelf: 'flex-end',
                  }}>
                  <View style={[styles.actionIconContainer]}>
                    <TouchableOpacity
                      style={styles.option}
                      onPress={() => toggleAddSafeguardItemPopup()}>
                      <View
                        style={[{flexDirection: 'row', alignItems: 'center'}]}>
                        <CustIcon
                          type="MaterialIcons"
                          name={'add'}
                          size={30}
                          color={Colors.primary}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              {/* <FlatList
								style={{padding: scale(10.0)}}
								data={props.safeguard.getSafeguard("5XoFLm2h73whI0QysCKY")}
								ItemSeparatorComponent={FlatListItemSeparator}
								keyExtractor={(item: any) => item.assistUserID}
								renderItem={(rec) => (
									<MedicineListItem
										key={rec.item.toString()}
										props={props}
										data={rec}
										onIncrement={(id) => {
											// addToCart(id);
											console.log('incremented')
										}}
										onDecrement={(id) => {
											// removeFromCart(id);
											console.log('decremented')
										}}
										onCopy={(id) => {
											console.log('Copied')
										}}
										onCut={(id) => {
											console.log('Cut')
										}}
										onPaste={(id) => {
											console.log('Pasted')
										}}
										onDelete={(id) => {
											console.log('Deleted')
										}}
									/>
								)}
							/> */}
              <ScrollView style={{}}>
                <SafeguardCustomMultiPicker
                  // options={props.safeguard.getSafeguard(
                  //   props.attendeeID ? attendeeID : attendeeID,
                  // )}
                  options={props.safeguard.safeguards.assistUser}
                  search={false}
                  multiple={true}
                  placeholder={'Search'}
                  placeholderTextColor={Colors.bodyTextGrey}
                  returnValue={'label'}
                  callback={(res) => {
                    console.log('res');
                    console.log(res);
                    setSelectedSafeguard(res);
                  }}
                  handleQuantityChange={handleQuantityChange}
                  defaultSelected={selectedSafeguard}
                  itemStyle={[
                    {backgroundColor: Colors.white},
                    styles.optionItem,
                    commonStyles.roundedButtonBoxShadow,
                  ]}
                  unselectedItemStyle={[
                    {backgroundColor: Colors.white},
                    styles.optionItem,
                    commonStyles.roundedButtonBoxShadow,
                  ]}
                  iconColor={Colors.primary}
                  // unselectedIconColor={Colors.lightGrey}
                  iconSize={scale(20)}
                  labelStyle={[
                    {
                      color: Colors.bodyTextGrey,
                    },
                    styles.label,
                  ]}
                  selectedIconName={'check-square'}
                  unselectedIconName={'square'}
                  scrollViewHeight={'100%'} // list of options which are selected by default
                />
              </ScrollView>
            </View>
            {/* Meds Image View and Upload */}
            <View style={[styles.boxShadowContainer, {marginTop: 15}]}>
              <Text
                style={{
                  color: Colors.grey,
                  fontSize: fontSize.h4,
                  textAlign: 'center',
                  marginBottom: scale(10),
                }}>
                Medical Tablets
              </Text>
              {props.safeguard.safeguards.assistUser.assistUserID ? (
                <View style={{}}>
                  <Carousel
                    layout={'stack'}
                    ref={(ref) => medsCarouselRef}
                    data={props.safeguard.safeguards.assistUser.medicines}
                    sliderWidth={screenWidth}
                    itemWidth={screenWidth - 100}
                    renderItem={renderItem}
                    // onSnapToItem = { index => setActiveMedsIndex(index) }
                    hasParallaxImages={true}
                  />
                  {/* <Pagination
										dotsLength={entries.length}
										activeDotIndex={activeMedsIndex}
										containerStyle={styles.paginationContainer}
										dotColor={'rgba(255, 255, 255, 0.92)'}
										dotStyle={styles.paginationDot}
										inactiveDotColor={Colors.black}
										inactiveDotOpacity={0.4}
										inactiveDotScale={0.6}
										carouselRef={medsCarouselRef}
										tappableDots={!!medsCarouselRef}
									/> */}
                </View>
              ) : null}
              <View style={styles.actionButtonContainer}>
                {/* <View style={styles.actionIconContainer}>
                  <TouchableOpacity
                    style={styles.option}
                    onPress={toggleAddSafeguardItemPopup}>
                    <View
                      style={[{flexDirection: 'row', alignItems: 'center'}]}>
                      <CustIcon
                        type="MaterialIcons"
                        name={'zoom-in'}
                        size={30}
                        color={Colors.primary}
                      />
                    </View>
                  </TouchableOpacity>
                </View> */}

                <View style={styles.actionIconContainer}>
                  <TouchableOpacity
                    style={styles.option}
                    onPress={handleImageUpload('meds')}>
                    <View
                      style={[{flexDirection: 'row', alignItems: 'center'}]}>
                      <CustIcon
                        type="MaterialIcons"
                        name={'add-circle-outline'}
                        size={30}
                        color={Colors.primary}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            {/* Rx Image View and Upload */}
            <View style={[styles.boxShadowContainer, {marginTop: 15}]}>
              <Text
                style={{
                  color: Colors.grey,
                  fontSize: fontSize.h4,
                  textAlign: 'center',
                  marginBottom: scale(10),
                }}>
                Rx Tablets
              </Text>
              {props.safeguard.safeguards.assistUser.assistUserID ? (
                <View style={{}}>
                  <Carousel
                    layout={'stack'}
                    ref={(ref) => rxCarouselRef}
                    data={props.safeguard.safeguards.assistUser.medicines}
                    sliderWidth={screenWidth}
                    itemWidth={screenWidth - 100}
                    renderItem={renderItem}
                    onSnapToItem={(index) => setActiveMedsIndex(index)}
                    hasParallaxImages={true}
                  />
                </View>
              ) : null}
              <View style={styles.actionButtonContainer}>
                {/* <View style={styles.actionIconContainer}>
                  <TouchableOpacity
                    style={styles.option}
                    onPress={toggleAddSafeguardItemPopup}>
                    <View
                      style={[{flexDirection: 'row', alignItems: 'center'}]}>
                      <CustIcon
                        type="MaterialIcons"
                        name={'zoom-in'}
                        size={30}
                        color={Colors.primary}
                      />
                    </View>
                  </TouchableOpacity>
                </View> */}

                <View style={styles.actionIconContainer}>
                  <TouchableOpacity
                    style={styles.option}
                    onPress={handleImageUpload('rx')}>
                    <View
                      style={[{flexDirection: 'row', alignItems: 'center'}]}>
                      <CustIcon
                        type="MaterialIcons"
                        name={'add-circle-outline'}
                        size={30}
                        color={Colors.primary}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <ScrollView>
              <Modal
                isVisible={onToggleAddSafeguardItemPopup}
                onBackdropPress={() => setOnToggleAddSafeguardItemPopup(false)}
                onSwipeComplete={() => setOnToggleAddSafeguardItemPopup(false)}
                swipeDirection="left">
                <View
                  style={[
                    styles.modalView,
                    commonStyles.whiteBoxShadow,
                    {padding: boxModelSize.m},
                  ]}>
                  <View style={styles.profileDetails}>
                    <Animatable.View
                      duration={500}
                      delay={0}
                      animation="fadeInUp">
                      <CustTextInput
                        label="Medicine Name"
                        placeholder="Enter medicine name"
                        onChangeText={(text) => setMedicineName(text)}
                        onEndEditing={() => {}}
                        errorText={medicineNameError}
                        value={medicineName}
                        keyboardType="name-phone-pad"
                        required
                      />
                    </Animatable.View>
                    <Animatable.View
                      duration={500}
                      delay={0}
                      animation="fadeInUp">
                      <CustTextInput
                        label="Quantity"
                        placeholder="Enter quantity"
                        onChangeText={(text) => setQuantity(text)}
                        onEndEditing={() => {}}
                        errorText={quantityError}
                        value={quantity}
                        autoCompleteType="name"
                        textContentType="name"
                        keyboardType="name-phone-pad"
                        required
                      />
                    </Animatable.View>
                    <Animatable.View
                      duration={500}
                      delay={0}
                      animation="fadeInUp">
                      <CustTextInput
                        label="Unit"
                        placeholder="Enter unit like strips, bottles, tablets or box"
                        onChangeText={(text) => setUnit(text)}
                        onEndEditing={() => {}}
                        errorText={unitError}
                        value={unit}
                        autoCompleteType="name"
                        textContentType="name"
                        keyboardType="name-phone-pad"
                        required
                      />
                    </Animatable.View>

                    <CustButton
                      type="default"
                      title={editMode ? 'Save' : 'Add'}
                      onPress={addSafeguardItemHandler}
                    />
                  </View>
                </View>
              </Modal>

              {/* <View>
								<SafeguardCustomMultiPicker
									options={props.safeguard.getSafeguard(attendeeID)}
									options2={props.safeguard.getSafeguardPatient("2")}
									search={true}
									multiple={true} 
									placeholder={'Search'}
									placeholderTextColor={Colors.bodyTextGrey}
									returnValue={'label'}
									callback={(res) => {
										setSelectedSafeguard(res);
									}}
									defaultSelected= {selectedSafeguard}
									itemStyle={[
										{backgroundColor: Colors.primary},
										styles.optionItem,
										commonStyles.roundedButtonBoxShadow,
									]}
									unselectedItemStyle={[
										{backgroundColor: Colors.white},
										styles.optionItem,
										commonStyles.roundedButtonBoxShadow,
									]}
									iconColor={Colors.lightGrey}
									unselectedIconColor={Colors.white}
									iconSize={scale(20)}
									labelStyle={[
										{
											color: Colors.white,
										},
										styles.label,
									]}
									unselectedLabelStyle={[
										{
											color: Colors.bodyTextGrey,
										},
										styles.label,
									]}
									selectedIconName={'check-circle'}
									unselectedIconName={'user'}
									scrollViewHeight={'100%'} // list of options which are selected by default
								/>
							</View> */}
            </ScrollView>
            <View style={{marginTop: 5, marginBottom: 20}}>
              <CustButton
                type="default"
                title="Verify & Submit"
                onPress={() =>
                  console.log(
                    'Verified & Submitted selection',
                    JSON.stringify(selectedSafeguard),
                  )
                }
              />
            </View>
          </ScrollView>
        </View>
        <View style={commonStyles.footerContainer}>
          <BottomNavigation />
        </View>
      </View>
    </SafeAreaView>
  );
};

export const styles = StyleSheet.create({
  headerContainer: {
    flex: 0.2,
  },

  boxShadowContainer: {
    borderRadius: 10,
    padding: 3,
    // borderWidth: 1,
    borderColor: '#ccc',
  },
  profileDetails: {flex: 1, paddingTop: boxModelSize.l},
  contentContainer: {
    flex: 0.8,
    backgroundColor: Colors.white,
    borderTopRightRadius: Constants.BOX_REDIUS,
    borderTopLeftRadius: Constants.BOX_REDIUS,
    zIndex: 1,
  },
  epcrNo: {
    textAlign: 'center',
    color: Colors.secondary,
    fontFamily: Fonts.primarySemiBold,
    fontSize: fontSize.h5,
  },

  label: {
    fontFamily: Fonts.primaryRegular,
    fontSize: fontSize.h5,
    // paddingLeft: scale(12),
  },

  unit: {
    fontFamily: Fonts.primaryRegular,
    fontSize: fontSize.h6,
    paddingLeft: scale(10),
  },

  modalView: {
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: Constants.BOX_REDIUS,
    height: '60%',
  },
  closeIconContainer: {
    position: 'absolute',
    top: scale(10),
    right: scale(10),
    width: '103%',
    alignItems: 'flex-end',
    zIndex: 22,
  },
  closeIcon: {
    width: scale(35),
    height: scale(35),
    // borderRadius: 30,
    // backgroundColor: Colors.primary,
    // borderWidth: 4,
    // borderColor: Colors.secondaryBackgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
    // borderStartColor: 'yellow',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginBottom: scale(15),
  },
  optionItem: {
    paddingLeft: scale(10),
    marginBottom: scale(10),
    // height: scale(70),
    flexDirection: 'row',
    // borderRadius: scale(45),
  },
  actionButtonContainer: {
    padding: scale(10),
    marginBottom: scale(5),
    height: scale(40),
    flexDirection: 'row',
    borderRadius: scale(45),
    justifyContent: 'center',
  },

  actionIconContainer: {
    width: scale(50),
    alignItems: 'center',
  },

  actionIconContainerCompact: {
    width: scale(30),
  },

  dashedTitle: {
    textAlign: 'center',
    color: 'grey',
    fontFamily: Fonts.primaryRegular,
    fontSize: fontSize.h3,
  },

  safeguardItemContainer: {
    flexDirection: 'row',
    width: '100%',
    // height: scale(60),
    padding: scale(10),
  },

  item: {
    width: screenWidth - 250,
    height: 150,
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ios: 0, android: 1}), // Prevent a random Android rendering issue
    backgroundColor: 'white',
    borderRadius: 8,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  paginationContainer: {
    paddingVertical: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 8,
  },

  title: {
    paddingHorizontal: 30,
    backgroundColor: 'transparent',
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
    // fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default inject('safeguard', 'assistRequests')(observer(Safeguard));
