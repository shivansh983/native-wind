import CustomScreen from '@/component/screen'
import { useAppStore } from '@/store/useStore'
import { COLORS } from '@/theme/colors'
import { FlatList, StyleSheet, Text, View } from 'react-native'

const STATUS_COLORS = {
  Success: '#16a34a',
  Failed: '#dc2626',
  Shared: '#d97706',
}

const HomeScreen = () => {
  const { stats, files, triggerUpload } = useAppStore()

  return (
    <CustomScreen title="Dashboard" onUpload={triggerUpload}>
      <View style={styles.grid}>
        <View style={[styles.card, styles.box]}>
          <Text style={styles.label}>Total Uploads</Text>
          <Text style={styles.value}>{stats.uploaded}</Text>
        </View>

        <View style={[styles.card, styles.box]}>
          <Text style={styles.label}>Success</Text>
          <Text style={[styles.value, { color: STATUS_COLORS.Success }]}>
            {stats.success}
          </Text>
        </View>

        <View style={[styles.card, styles.box]}>
          <Text style={styles.label}>Failed</Text>
          <Text style={[styles.value, { color: STATUS_COLORS.Failed }]}>
            {stats.failed}
          </Text>
        </View>

        <View style={[styles.card, styles.box]}>
          <Text style={styles.label}>Shared</Text>
          <Text style={[styles.value, { color: STATUS_COLORS.Shared }]}>
            {stats.shared}
          </Text>
        </View>
      </View>

      {
        // files
      }
      <Text style={[styles.title, { fontSize: 16, marginVertical: 14 }]}>
        Uploaded Files
      </Text>

      <FlatList
        data={files}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={[styles.card, { alignItems: 'center', paddingVertical: 32 }]}>
            <Text style={styles.label}>No files yet</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.card, styles.row]}>
            <View style={styles.fileInfo}>
              <Text style={styles.title} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.label}>
                {item.size} · {item.date}
              </Text>
            </View>

            <Text
              style={[
                styles.label,
                { fontWeight: 'bold', color: STATUS_COLORS[item.status] },
              ]}
            >
              {item.status}
            </Text>
          </View>
        )}
      />
    </CustomScreen>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  // layout
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
  },
  box: {
    flexBasis: '45%',
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  fileInfo: {
    flex: 1,
    paddingRight: 12,
  },

  // text
  label: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textMain,
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 4,
  },
})
