import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  User,
  Heart,
  Clock,
  Edit2,
  CreditCard,
  Bell,
  Globe,
  HelpCircle,
  Mail,
  FileText,
  ShoppingCart,
  LogOut,
  Trash2,
  ChevronRight,
  ArrowLeft,
  Flame,
  Users,
  AlarmClock,
  AlertTriangle,
} from 'lucide-react-native';
import { Colors, FontSizes, Spacing } from '../constants/style';
import Toggle from '../components/toogle';
import Dialog from '../components/dialog';
import { router } from 'expo-router';

const Profile = () => {
  const [dietaryPreferences, setDietaryPreferences] = useState({
    vegetarian: true,
    vegan: false,
    pescatarian: true,
    halal: false,
    glutenFree: false,
  });

  const [allergens, setAllergens] = useState(['Peanuts', 'Dairy']);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [spiceLevel, setSpiceLevel] = useState('medium');
  const [portionSize, setPortionSize] = useState('normal');
  const [cookingTime, setCookingTime] = useState('any');

  const handleDeleteAccount = (confirmed) => {
    if (confirmed) {
      console.log('Account deleted');
    }
    setShowDeleteDialog(false);
  };

  const toggleAllergen = (allergen) => {
    setAllergens((prev) =>
      prev.includes(allergen)
        ? prev.filter((a) => a !== allergen)
        : [...prev, allergen]
    );
  };

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        <View style={styles.profileTitleContainer}>
         <TouchableOpacity style={styles.backButton}>
            <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.profileTitle}>Profile</Text>
        </View>

        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
           { /** replace later with the provide user image */}
            <User size={32} color={Colors.primary} />
            <View style={styles.editBadge}>
              <Edit2 size={14} color="#fff" />
            </View>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>John Doe</Text>
            <Text style={styles.email}>john.doe@email.com</Text>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Heart size={24} color={Colors.primary} />
            </View>
            <Text style={styles.statLabel}>Favorites</Text>
            <Text style={styles.statNumber}>12</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Clock size={24} color={Colors.primary} />
            </View>
            <Text style={styles.statLabel}>History</Text>
            <Text style={styles.statNumber}>28</Text>
          </View>
        </View>

        {/* Food Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Food preferences</Text>

          {/* Dietary Preferences */}
          <Text style={styles.subTitle}>Dietary preferences</Text>
          {Object.entries(dietaryPreferences).map(([key, value]) => (
            <View key={key} style={styles.preferenceRow}>
              <Text style={styles.preferenceLabel}>
                {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
              </Text>
              <Toggle
                initialValue={value}
                onValueChange={(newValue) =>
                  setDietaryPreferences((prev) => ({
                    ...prev,
                    [key]: newValue,
                  }))
                }
              />
            </View>
          ))}

          {/* Allergens */}
          <View style={styles.allergensSection}>
            <View style={styles.allergensTitleContainer}>
              <Text style={styles.subTitle}>Allergens</Text>
              <View style={styles.importantBadge}>
                <AlertTriangle size={12} color={Colors.primary} />
                <Text style={styles.importantText}> Important</Text>
              </View>
            </View>
            <View style={styles.allergensGrid}>
              {['Peanuts', 'Dairy', 'Eggs', 'Soy', 'Gluten', 'Shellfish', 'Tree nuts', 'Fish'].map(
                (allergen) => (
                  <Pressable
                    key={allergen}
                    style={[
                      styles.allergenButton,
                      allergens.includes(allergen) && styles.allergenButtonActive,
                    ]}
                    onPress={() => toggleAllergen(allergen)}
                  >
                    <Text
                      style={[
                        styles.allergenText,
                        allergens.includes(allergen) && styles.allergenTextActive,
                      ]}
                    >
                      {allergen}
                    </Text>
                  </Pressable>
                )
              )}
            </View>
          </View>

          {/* Personalization */}
          <Text style={[styles.subTitle, { marginTop: Spacing.large }]}>
            Personalization
          </Text>

          {/* Spice Level */}
          <View style={styles.customizationItem}>
            <View style={styles.customizationHeader}>
              <Flame color={Colors.primary} size={16}/>
              <Text style={styles.customizationLabel}> Spice level</Text>
            </View>
            <View style={styles.buttonGroup}>
              {['Mild', 'Medium', 'Hot'].map((level) => (
                <Pressable
                  key={level}
                  style={[
                    styles.groupButton,
                    spiceLevel.toLowerCase() === level.toLowerCase() &&
                      styles.groupButtonActive,
                  ]}
                  onPress={() => setSpiceLevel(level.toLowerCase())}
                >
                  <Text
                    style={[
                      styles.groupButtonText,
                      spiceLevel.toLowerCase() === level.toLowerCase() &&
                        styles.groupButtonTextActive,
                    ]}
                  >
                    {level}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Portion Size */}
          <View style={styles.customizationItem}>
            <View style={styles.customizationHeader}>
              <Users color={Colors.primary} size={16}/>
              <Text style={styles.customizationLabel}> Portion size</Text>
            </View>
            <View style={styles.buttonGroup}>
              {['Small', 'Normal', 'Large'].map((size) => (
                <Pressable
                  key={size}
                  style={[
                    styles.groupButton,
                    portionSize.toLowerCase() === size.toLowerCase() &&
                      styles.groupButtonActive,
                  ]}
                  onPress={() => setPortionSize(size.toLowerCase())}
                >
                  <Text
                    style={[
                      styles.groupButtonText,
                      portionSize.toLowerCase() === size.toLowerCase() &&
                        styles.groupButtonTextActive,
                    ]}
                  >
                    {size}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Cooking Time */}
          <View style={styles.customizationItem}>
            <View style={styles.customizationHeader}>
              <AlarmClock color={Colors.primary} size={16}/>
              <Text style={styles.customizationLabel}>
                Cooking time</Text>
            </View>
            <View style={styles.buttonGroup}>
              {['Quick', 'Any'].map((time) => (
                <Pressable
                  key={time}
                  style={[
                    styles.groupButton,
                    cookingTime.toLowerCase() === time.toLowerCase() &&
                      styles.groupButtonActive,
                  ]}
                  onPress={() => setCookingTime(time.toLowerCase())}
                >
                  <Text
                    style={[
                      styles.groupButtonText,
                      cookingTime.toLowerCase() === time.toLowerCase() &&
                        styles.groupButtonTextActive,
                    ]}
                  >
                    {time}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <MenuItem icon={Edit2} label="Edit profile" />
          <MenuItem icon={CreditCard} label="Subscription" badge="Pro" />
          <MenuItem icon={Bell} label="Notifications" />
          <MenuItem icon={Globe} label="Language" />
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <MenuItem icon={HelpCircle} label="Help & FAQ" />
          <MenuItem icon={Mail} label="Contact support" />
          <MenuItem icon={FileText} label="Privacy policy" />
          <MenuItem icon={ShoppingCart} label="Terms of service" />
        </View>

        {/* Logout Button */}
        <Pressable style={styles.logoutButton}>
          <LogOut size={20} color={Colors.text} />
          <Text style={styles.logoutText}>Log out</Text>
        </Pressable>

        {/* Delete Account Button */}
        <Pressable
          style={styles.deleteButton}
          onPress={() => setShowDeleteDialog(true)}
        >
          <Trash2 size={20} color={Colors.primary} />
          <Text style={styles.deleteText}>Delete account</Text>
        </Pressable>

        <View style={{ height: Spacing.large }} />
      </ScrollView>

      {/* Delete Dialog */}
      <Dialog
        visible={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteAccount}
        title="Delete account?"
        description="This action cannot be undone. All your data, preferences, and saved recipes will be permanently deleted."
        icon={Trash2}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor={Colors.primary}
      />
    </>
  );
};

const MenuItem = ({ icon: IconComponent, label, badge , destination }) => (
  <Pressable style={styles.menuItem} onPress={()=> {destination && router.push(destination)}}>
    <View style={styles.menuLeft}>
      <View style={styles.menuIcon}>
        <IconComponent size={24} color={Colors.primary} />
      </View>
      <Text style={styles.menuLabel}>{label}</Text>
    </View>
    <View style={styles.menuRight}>
      {badge && <Text style={styles.badge}>{badge}</Text>}
      <ChevronRight size={20} color={Colors.icon} />
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.medium,
    paddingTop: Spacing.medium,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.large,
    paddingHorizontal: Spacing.medium,
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    marginBottom: Spacing.large,
  },
  profileTitleContainer: {
     flexDirection: 'row',
     textAlign: 'center',
     alignItems: 'center',
     paddingTop: Spacing.medium,
     gap: Spacing.medium,
  },
  profileTitle: {
    fontSize: FontSizes.xlarge,
    fontFamily: 'Lora',
    fontStyle: 'italic',
    fontWeight: '700',
    color: Colors.text,
  },
    backButton: {
    alignSelf: 'flex-start',
    width: 32,
    height: 32,
    borderRadius: 16,
    borderColor: Colors.text,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.medium,
    },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFE0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.medium,
    position: 'relative',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: FontSizes.large,
    fontFamily: 'Lora',
    fontStyle: 'italic',
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: FontSizes.small,
    color: Colors.icon,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: Spacing.medium,
    marginBottom: Spacing.large,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: Spacing.medium,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFE0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.small,
  },
  statLabel: {
    fontSize: FontSizes.small,
    color: Colors.icon,
    marginBottom: 4,
  },
  statNumber: {
    fontSize: FontSizes.large,
    fontWeight: '600',
    color: Colors.text,
  },
  section: {
    marginBottom: Spacing.large,
  },
  sectionTitle: {
    fontSize: FontSizes.large,
    fontFamily: 'Lora',
    fontStyle: 'italic',
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.medium,
  },
  subTitle: {
    fontFamily: 'Inter',
    fontSize: FontSizes.medium,
    fontWeight: '600',
    color: Colors.icon,
    marginBottom: Spacing.medium,
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.small,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    marginBottom: Spacing.small,
  },
  preferenceLabel: {
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: FontSizes.medium,
    color: Colors.text,
  },
  allergensSection: {
    marginTop: Spacing.large,
  },
  allergensTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.small,
    marginBottom: Spacing.medium,
  },
  importantBadge: {
    flexDirection: 'row',
    gap: 2 ,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFE0E0',
    paddingHorizontal: Spacing.small,
    paddingVertical: 4,
    borderRadius: 12,
  },
  importantText: {
    fontSize: FontSizes.small,
    fontFamily: 'Inter',
    color: Colors.primary,
    fontWeight: '600',
  },
  allergensGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.small,
  },
  allergenButton: {
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.small,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginBottom: Spacing.small,
  },
  allergenButtonActive: {
    backgroundColor: Colors.primary,
  },
  allergenText: {
    fontSize: FontSizes.small,
    fontFamily: 'Inter',
    color: Colors.text,
    fontWeight: '400',
  },
  allergenTextActive: {
    color: '#fff',
  },
  customizationItem: {
    marginBottom: Spacing.large,
  },
  customizationHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: Spacing.small,
    marginBottom: Spacing.medium,
  },
  customizationLabel: {
    fontSize: FontSizes.medium,
    fontFamily: 'Inter',
    fontWeight: '600',
    color: Colors.text,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: Spacing.small,
    flexWrap: 'wrap',
  },
  groupButton: {
    flex: 1,
    minWidth: '30%',
    paddingVertical: Spacing.medium,
    paddingHorizontal: Spacing.medium,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupButtonActive: {
    backgroundColor: Colors.primary,
  },
  groupButtonText: {
    fontSize: FontSizes.small,
    color: Colors.icon,
    fontWeight: '600',
  },
  groupButtonTextActive: {
    color: '#fff',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.medium,
    paddingHorizontal: Spacing.small,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.medium,
  },
  menuLabel: {
    fontSize: FontSizes.medium,
    fontFamily: 'Inter',
    color: Colors.text,
    fontWeight: '400',
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.small,
  },
  badge: {
    fontSize: FontSizes.small,
    fontFamily: 'Inter',
    color: Colors.primary,
    fontWeight: '600',
    backgroundColor: '#FFE0E0',
    paddingHorizontal: Spacing.small,
    paddingVertical: 4,
    borderRadius: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.medium,
    gap: Spacing.small,
    marginVertical: Spacing.large,
  },
  logoutText: {
    fontSize: FontSizes.medium,
    fontFamily: 'Inter',
    fontWeight: '600',
    color: Colors.text,
  },
  deleteButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.medium,
    gap: Spacing.small,
    marginBottom: Spacing.large,
  },
  deleteText: {
    fontSize: FontSizes.medium,
    fontFamily: 'Inter',
    fontWeight: '600',
    color: Colors.primary,
  },
});

export default Profile;