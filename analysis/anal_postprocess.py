from kafka_shock import KafkaShock
tag_map = {
            'me-upcoming':'me-upcoming', 
            'new_collections': 'new-collections', 
            '1h':'popular-collections-1h', 
            '1d': 'popular-collections-1day', 
            '7d': 'popular-collections-7days', 
            '30d': 'popular-collections-30days',
            'request-upcoming': 'request-upcoming',
            'request-me': 'request-me'
            }

def process_all_collections_for_db(tag_to_data):
  name_map = {}
  for me_tag, data in tag_to_data.items():
    db_tag = tag_map[me_tag]
    for nft_info in data:
      name = nft_info['name']
      if name not in name_map:
        if '_id' in nft_info: nft_info.pop('_id')

        name_map[name] = {
          **nft_info,
          'tags': set([db_tag])
        }
      else:
        tag_set = name_map[name]['tags']
        if db_tag == 'request-upcoming' and 'me-upcoming' in tag_set:
          continue
        tag_set.add(db_tag)

  #convert tag set to list of tags
  for nft_info in name_map.values():
    # print(nft_info['tags'])
    nft_info['tags'] = list(nft_info['tags'])
  
  return list(name_map.values())


# def process_all_collections_for_db(tag_to_data):
#     symbol_map = {}
#     for tag, data in tag_to_data.items():
#         for col in data:
#             symbol = col['symbol']
#             if symbol not in symbol_map:
#                 if '_id' in col:
#                     col.pop('_id')
#                 symbol_map[symbol] = {
#                     **col,
#                     **{v: False for k, v in tag_map.items()}
#                 }

#     for tag, data in tag_to_data.items():
#         for col in data:
#             symbol = col['symbol']
#             db_tag = tag_map[tag]
#             symbol_map[symbol][db_tag] = True

#     return list(symbol_map.values())

def map_nfts_to_tag(all_nfts_stat, tags):
  nft_map = {tag: [] for tag in tags}
  
  for nft in all_nfts_stat:
    for tag in nft['tags']:
      if '_id' in nft: nft.pop('_id')
      col_info = {
                    **nft,
                    'tag': tag
                }
        
      nft_map[tag].append(col_info)
  
  return nft_map

def send_shock_to_discord(nfts):
    kafka = KafkaShock()
    for nft in nfts:
        kafka.stream_obj_to_kafka(nft)