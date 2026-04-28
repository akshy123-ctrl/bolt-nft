#[cfg(test)]
mod test {
    extern crate royalty_splitter;
    extern crate start_nft;
    use crate::{Marketplace, MarketplaceClient};
    use soroban_sdk::testutils::{Address as _};
    use soroban_sdk::{token, Address, Env};

    #[test]
    fn test_marketplace() {
        let env = Env::default();
        env.mock_all_auths();

        let seller = Address::generate(&env);
        let buyer = Address::generate(&env);
        let creator = Address::generate(&env);

        let splitter_id = env.register(royalty_splitter::RoyaltySplitter, ());
        let marketplace_id = env.register(Marketplace, ());
        let nft_id = env.register(start_nft::StartNFT, ());

        // Setup tokens
        let payment_token_admin = Address::generate(&env);
        let payment_contract = env.register_stellar_asset_contract_v2(payment_token_admin.clone());
        let payment_token = payment_contract.address();
        let payment_client = token::Client::new(&env, &payment_token);
        let payment_admin_client = token::StellarAssetClient::new(&env, &payment_token);

        // Mint tokens to buyer
        payment_admin_client.mint(&buyer, &1000);

        // Mint NFT to seller
        let nft_token_id = 1;
        let nft_client = start_nft::StartNFTClient::new(&env, &nft_id);
        nft_client.mint(&seller, &nft_token_id);

        let marketplace_client = MarketplaceClient::new(&env, &marketplace_id);

        // List NFT
        marketplace_client.list_nft(
            &seller,
            &nft_id,
            &nft_token_id,
            &payment_token,
            &1000,
            &creator,
            &1000, // 10% royalty
        );

        // Buy NFT
        marketplace_client.buy_nft(&buyer, &nft_token_id, &splitter_id);

        // Verify balances
        assert_eq!(nft_client.owner_of(&nft_token_id), buyer);
        assert_eq!(payment_client.balance(&creator), 100);
        assert_eq!(payment_client.balance(&seller), 900);
    }

    #[test]
    fn test_delist_nft() {
        let env = Env::default();
        env.mock_all_auths();

        let seller = Address::generate(&env);
        let creator = Address::generate(&env);
        let marketplace_id = env.register(Marketplace, ());
        let nft_id = env.register(start_nft::StartNFT, ());
        let payment_token_admin = Address::generate(&env);
        let payment_contract = env.register_stellar_asset_contract_v2(payment_token_admin.clone());
        let payment_token = payment_contract.address();

        let nft_token_id = 1;
        let nft_client = start_nft::StartNFTClient::new(&env, &nft_id);
        nft_client.mint(&seller, &nft_token_id);

        let marketplace_client = MarketplaceClient::new(&env, &marketplace_id);

        marketplace_client.list_nft(&seller, &nft_id, &nft_token_id, &payment_token, &1000, &creator, &1000);
        assert_eq!(nft_client.owner_of(&nft_token_id), marketplace_id);

        marketplace_client.delist_nft(&seller, &nft_token_id);
        assert_eq!(nft_client.owner_of(&nft_token_id), seller);
        assert!(marketplace_client.get_listing(&nft_token_id).is_none());
    }

    #[test]
    fn test_get_listing() {
        let env = Env::default();
        env.mock_all_auths();

        let seller = Address::generate(&env);
        let creator = Address::generate(&env);
        let marketplace_id = env.register(Marketplace, ());
        let nft_id = env.register(start_nft::StartNFT, ());
        let payment_token_admin = Address::generate(&env);
        let payment_contract = env.register_stellar_asset_contract_v2(payment_token_admin.clone());
        let payment_token = payment_contract.address();

        let nft_token_id = 42;
        let nft_client = start_nft::StartNFTClient::new(&env, &nft_id);
        nft_client.mint(&seller, &nft_token_id);

        let marketplace_client = MarketplaceClient::new(&env, &marketplace_id);
        
        assert!(marketplace_client.get_listing(&nft_token_id).is_none());

        marketplace_client.list_nft(&seller, &nft_id, &nft_token_id, &payment_token, &1000, &creator, &1000);
        
        let listing = marketplace_client.get_listing(&nft_token_id).unwrap();
        assert_eq!(listing.seller, seller);
        assert_eq!(listing.price, 1000);
        assert_eq!(listing.nft_token, nft_id);
    }
}
